export const subjectKeys = {
  all: ["subjects"] as const,
  byInstitution: (institutionId: string) =>
    [...subjectKeys.all, "institution", institutionId] as const,
};
