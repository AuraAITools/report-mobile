import { z } from "zod";
import { decode as atob, encode as btoa } from "base-64";

// Zod schema for the access token JWT payload.
//
// Validation philosophy: be permissive about what Keycloak emits — the
// website pulls claims with no validation at all. We keep enough structure
// to power our auth context while tolerating realistic variation:
//   - jti/sid are not guaranteed UUIDs in modern Keycloak builds
//   - aud is allowed to be a single string (OIDC spec) and normalized to an array
//   - resource_access is legacy — users without client-specific roles won't
//     have an "aura-application-client" entry; authorization now flows through
//     `groups` (read by report-ms) and SpiceDB-backed permissions
export const AccessTokenSchema = z
  .object({
    // Standard JWT claims
    exp: z.number().int().positive(),
    iat: z.number().int().positive(),
    auth_time: z.number().int().positive().optional(),
    jti: z.string(),
    iss: z.string().url(),
    aud: z
      .union([z.string(), z.array(z.string())])
      .transform((v) => (Array.isArray(v) ? v : [v])),
    sub: z.string().uuid(),
    typ: z.string().optional(),
    azp: z.string().optional(),
    sid: z.string().optional(),
    acr: z.string().optional(),

    ext_attrs: z
      .object({
        tenant_ids: z.array(z.string()).default([]),
      })
      .partial()
      .optional(),

    "allowed-origins": z.array(z.string()).optional(),

    // Legacy client-role mapping. Present only when the user has roles
    // assigned to the client; otherwise the field is absent.
    resource_access: z
      .record(z.object({ roles: z.array(z.string()) }).partial())
      .optional(),

    // New authoritative role source — emitted by the microprofile-jwt
    // scope's realm-role mapper and consumed by report-ms' UserMapper.
    groups: z.array(z.string()).optional(),

    scope: z.string().optional(),
    email_verified: z.boolean().optional(),
    name: z.string().optional(),
    preferred_username: z.string().optional(),
    given_name: z.string().optional(),
    family_name: z.string().optional(),
    email: z.string().email().optional(),
  })
  .passthrough();

// TypeScript type inferred from the Zod schema
export type AccessToken = z.infer<typeof AccessTokenSchema>;

// Helper functions for working with the access token
export class AccessTokenUtils {
  /**
   * Validates and parses an access token payload
   */
  static parse(tokenPayload: unknown): AccessToken {
    return AccessTokenSchema.parse(tokenPayload);
  }

  /**
   * Safely validates an access token payload without throwing
   */
  static safeParse(
    tokenPayload: unknown
  ): z.SafeParseReturnType<unknown, AccessToken> {
    return AccessTokenSchema.safeParse(tokenPayload);
  }

  /**
   * Checks if the token is expired
   */
  static isExpired(token: AccessToken): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return token.exp <= currentTime;
  }

  /**
   * Gets time until expiration in seconds
   */
  static getTimeUntilExpiration(token: AccessToken): number {
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, token.exp - currentTime);
  }

  /**
   * Gets all roles for a specific resource. Returns an empty array when the
   * claim is missing — common for users whose authorization is now driven by
   * `groups` rather than client-specific role assignments.
   */
  static getResourceRoles(token: AccessToken, resource: string): string[] {
    return token.resource_access?.[resource]?.roles ?? [];
  }

  /**
   * Gets the groups claim — the new authoritative role source consumed by
   * report-ms.
   */
  static getGroups(token: AccessToken): string[] {
    return token.groups ?? [];
  }

  /**
   * Gets user's full name
   */
  static getFullName(token: AccessToken): string {
    return token.name || `${token.given_name ?? ""} ${token.family_name ?? ""}`.trim();
  }

  /**
   * Checks if the token is valid (not expired and well-formed)
   */
  static isValid(tokenPayload: unknown): boolean {
    const parseResult = AccessTokenUtils.safeParse(tokenPayload);
    if (!parseResult.success) {
      return false;
    }
    return !AccessTokenUtils.isExpired(parseResult.data);
  }

  /**
   * Decodes JWT token (without verification - only for reading payload)
   * Note: This should only be used for reading claims, not for security validation
   */
  static decodeJWT(token: string): AccessToken {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      return AccessTokenSchema.parse(payload);
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
      throw new Error("Invalid JWT token format");
    }
  }
}
