import { z } from "zod";
import { decode as atob, encode as btoa } from "base-64";

// Zod schema for the access token JWT payload
export const AccessTokenSchema = z
  .object({
    // Standard JWT claims
    exp: z.number().int().positive(), // Expiration time (Unix timestamp)
    iat: z.number().int().positive(), // Issued at time (Unix timestamp)
    auth_time: z.number().int().positive(), // Authentication time (Unix timestamp)
    jti: z.string().uuid(), // JWT ID
    iss: z.string().url(), // Issuer
    aud: z.array(z.string()), // Audience
    sub: z.string().uuid(), // Subject (user ID)
    typ: z.literal("Bearer"), // Token type
    azp: z.string(), // Authorized party (client ID)
    sid: z.string().uuid(), // Session ID
    acr: z.string(), // Authentication Context Class Reference
    ext_attrs: z.object({
      tenant_ids: z.array(z.string().uuid()), // Tenant IDs (if multi-tenant)
    }),

    // Keycloak specific claims
    "allowed-origins": z.array(z.string()),

    resource_access: z.object({
      "aura-application-client": z.object({
        roles: z.array(z.string()),
      }),
    }),

    // Scope and user info
    scope: z.string(),
    email_verified: z.boolean(),
    name: z.string(),
    preferred_username: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    email: z.string().email(),
  })
  .passthrough(); // Allow additional properties not defined in the schema

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
   * Gets all roles for a specific resource
   * TODO: make resource configurable to more than aura-application-client
   */
  static getResourceRoles(token: AccessToken, resource: string): string[] {
    const resourceAccess = token.resource_access["aura-application-client"];
    return resourceAccess ? resourceAccess.roles : [];
  }

  /**
   * Gets user's full name
   */
  static getFullName(token: AccessToken): string {
    return token.name || `${token.given_name} ${token.family_name}`;
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
