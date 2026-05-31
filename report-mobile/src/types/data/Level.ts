import { z } from "zod";
import { BaseCourseSchema } from "./Course";
import { BaseEducatorSchema } from "./Educator";
import { BaseStudentSchema } from "./Student";
import { BaseSubjectSchema } from "./Subject";

export const BaseLevelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type BaseLevel = z.infer<typeof BaseLevelSchema>;

export const LevelWithAssociationsSchema = BaseLevelSchema.extend({
  subjects: z.lazy(() => z.array(BaseSubjectSchema)),
  courses: z.lazy(() => z.array(BaseCourseSchema)),
  students: z.lazy(() => z.array(BaseStudentSchema)),
  educators: z.lazy(() => z.array(BaseEducatorSchema)),
});

export type LevelWithAssociations = z.infer<typeof LevelWithAssociationsSchema>;
