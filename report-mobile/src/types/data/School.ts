import { z } from "zod";

export const BaseSchoolSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  school_category: z.string(),
});

export type BaseSchool = z.infer<typeof BaseSchoolSchema>;
