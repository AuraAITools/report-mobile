export const accountKeys = {
  all: ["accounts"] as const,
  byId: (accountId: string) => [...accountKeys.all, "byId", accountId] as const,
  byInstitution: (institutionId: string) =>
    [...accountKeys.all, "institution", institutionId] as const,
  byUserAndInstitution: (institutionId: string, userId: string) =>
    [...accountKeys.all, "byUser", institutionId, userId] as const,
  myAccount: (institutionId: string, userId: string) =>
    [...accountKeys.all, "me", institutionId, userId] as const,
};
