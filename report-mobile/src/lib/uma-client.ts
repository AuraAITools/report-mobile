import { env } from "@/utils/env";
import { AuraSecureStore } from "@/lib/secure-store";

const TOKEN_ENDPOINT = `${env.issuerUrl}/protocol/openid-connect/token`;
const ACCESS_TOKEN_KEY = "access_token";

export type UmaPermission = {
  rsid: string;
  rsname?: string;
  scopes: string[];
};

export type RptResult = {
  rpt: string;
  permissions: UmaPermission[];
};

/**
 * Reads the current access token from secure storage.
 * Throws if no token is available.
 */
async function getAccessToken(): Promise<string> {
  const token = await AuraSecureStore.getInstance().getValueFor(ACCESS_TOKEN_KEY);
  if (!token) {
    throw new Error("No access token available for UMA request");
  }
  return token;
}

/**
 * Exchanges the current access token for a Requesting Party Token (RPT)
 * scoped to a specific resource and set of scopes.
 *
 * Returns the RPT and its associated permissions, or `null` if the
 * authorization server responds with 403 (access denied).
 */
export async function requestRpt(
  resourceId: string,
  scopes: string[],
): Promise<RptResult | null> {
  const accessToken = await getAccessToken();

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
    audience: env.clientId,
    permission: scopes.length > 0 ? `${resourceId}#${scopes.join(",")}` : resourceId,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
    },
    body: body.toString(),
  });

  if (response.status === 403) {
    if (__DEV__) {
      console.warn("UMA permission denied for resource:", resourceId);
    }
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`UMA RPT exchange failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Decode the RPT to extract permissions from the payload
  const rpt: string = data.access_token;
  const permissions: UmaPermission[] = data.permissions ?? parsePermissionsFromRpt(rpt);

  return { rpt, permissions };
}

/**
 * Checks whether the caller has a specific permission on a resource
 * using the UMA decision endpoint (response_mode=decision).
 */
export async function checkPermission(
  resourceId: string,
  scope: string,
): Promise<boolean> {
  const accessToken = await getAccessToken();

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
    audience: env.clientId,
    permission: `${resourceId}#${scope}`,
    response_mode: "decision",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
    },
    body: body.toString(),
  });

  if (response.status === 403) {
    return false;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`UMA decision check failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.result === true;
}

/**
 * Attempts to extract permissions from an RPT JWT payload.
 * Falls back to an empty array if parsing fails.
 */
function parsePermissionsFromRpt(rpt: string): UmaPermission[] {
  try {
    const payloadSegment = rpt.split(".")[1];
    const decoded = JSON.parse(atob(payloadSegment));
    const authorization = decoded.authorization;
    if (Array.isArray(authorization?.permissions)) {
      return authorization.permissions;
    }
    return [];
  } catch {
    if (__DEV__) {
      console.warn("Could not parse permissions from RPT");
    }
    return [];
  }
}
