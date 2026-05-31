export const institutionKeys = {
  all: ["institutions"] as const,
  byId: (institutionId: string) =>
    [...institutionKeys.all, "byId", institutionId] as const,
  byIds: (institutionIds: readonly string[]) =>
    [...institutionKeys.all, "byIds", [...institutionIds].sort().join(",")] as const,
};
