export const outletKeys = {
  all: ["outlets"] as const,
  byInstitution: (institutionId: string) =>
    [...outletKeys.all, "institution", institutionId] as const,
  acrossInstitutions: (institutionIds: readonly string[]) =>
    [
      ...outletKeys.all,
      "acrossInstitutions",
      [...institutionIds].sort().join(","),
    ] as const,
};
