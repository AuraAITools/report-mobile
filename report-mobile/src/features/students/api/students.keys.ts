export const studentKeys = {
  all: ["students"] as const,
  byInstitution: (institutionId: string) =>
    [...studentKeys.all, "institution", institutionId] as const,
  byId: (institutionId: string, studentId: string) =>
    [...studentKeys.all, "byId", institutionId, studentId] as const,
};
