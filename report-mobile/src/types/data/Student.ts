import { z } from "zod";
import { BaseAccountSchema } from "./Account";
import { BaseCourseSchema } from "./Course";
import { BaseLevelSchema } from "./Level";
import { BaseOutletSchema } from "./Outlet";

export const BaseStudentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  date_of_birth: z.coerce.date(), // handle string dates
  school: z.string(),
});

export const ExpandedStudentSchema = BaseStudentSchema.extend({
  level: z.lazy(() => BaseLevelSchema),
  accounts: z.lazy(() => BaseAccountSchema.array()),
  courses: z.lazy(() => BaseCourseSchema.array()),
  outlets: z.lazy(() => BaseOutletSchema.array()),
});

export type BaseStudent = z.infer<typeof BaseStudentSchema>;
export type ExpandedStudent = z.infer<typeof ExpandedStudentSchema>;
