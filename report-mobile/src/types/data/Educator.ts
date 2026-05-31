import { z } from "zod";
import { BaseAccountSchema } from "./Account";
import { BaseCourseSchema } from "./Course";
import { BaseLevelSchema } from "./Level";
import { BaseOutletSchema } from "./Outlet";
import { BaseSubjectSchema } from "./Subject";

export const EMPLOYMENT_TYPE = ["FULL_TIME", "PART_TIME"] as const;
export const BaseEducatorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  start_date: z.string().date(),
  date_of_birth: z.string().date(),
  employment_type: z.enum(EMPLOYMENT_TYPE),
});

export type BaseEducator = z.infer<typeof BaseEducatorSchema>;

export const ExpandedEducatorSchema = BaseEducatorSchema.extend({
  levels: z.lazy(() => BaseLevelSchema.array()),
  subjects: z.lazy(() => BaseSubjectSchema.array()),
  outlets: z.lazy(() => BaseOutletSchema.array()),
  courses: z.lazy(() => BaseCourseSchema.array()),
  accounts: z.lazy(() => BaseAccountSchema.array()),
});
export type ExpandedEducator = z.infer<typeof ExpandedEducatorSchema>;

// TODO: remove cos irrelevant see if can repurpose this to some other type
export const BaseEducatorClientSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  contact: z.string(),
  educator: BaseEducatorSchema,
});

export type BaseEducatorClient = z.infer<typeof BaseEducatorClientSchema>;
