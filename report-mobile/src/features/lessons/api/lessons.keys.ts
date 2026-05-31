export const lessonKeys = {
  all: ["lessons"] as const,
  byCourse: (institutionId: string, courseId: string) =>
    [...lessonKeys.all, "course", institutionId, courseId] as const,
  byOutlet: (institutionId: string, outletId: string) =>
    [...lessonKeys.all, "outlet", institutionId, outletId] as const,
  byId: (institutionId: string, lessonId: string) =>
    [...lessonKeys.all, "byId", institutionId, lessonId] as const,
};
