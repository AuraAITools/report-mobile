export const courseKeys = {
  all: ["courses"] as const,
  byOutlet: (institutionId: string, outletId: string) =>
    [...courseKeys.all, "outlet", institutionId, outletId] as const,
  byId: (courseId: string) => [...courseKeys.all, "byId", courseId] as const,
};
