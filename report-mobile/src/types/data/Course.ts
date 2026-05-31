import { z } from "zod";
import { BaseLevelSchema } from "./Level";
import { BaseOutletSchema } from "./Outlet";
import { BaseSubjectSchema } from "./Subject";

export const PRICE_FREQUENCIES = [
  "MONTHLY",
  "WEEKLY",
  "PER_LESSON",
  "TOTAL",
] as const;

export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;
export type PriceFrequency = (typeof PRICE_FREQUENCIES)[number];
export type Days = (typeof DAYS)[number];
export const BaseLessonGenerationTemplateSchema = z.object({
  id: z.string().uuid(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  day_of_week: z.enum(DAYS),
  week_number: z.number(),
});

export const LESSON_FREQUENCY = ["WEEKLY", "FORTNIGHTLY", "MONTHLY"] as const;
export const BaseCourseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  max_size: z.coerce.number().min(1).max(10000),
  price: z.coerce.number().min(0).max(10000),
  price_frequency: z.enum(PRICE_FREQUENCIES),
  course_start_timestamptz: z.string().datetime({ offset: true }),
  course_end_timestamptz: z.string().datetime({ offset: true }),
  lesson_frequency: z.enum(LESSON_FREQUENCY),
});

export type BaseLessonGenerationTemplate = z.infer<
  typeof BaseLessonGenerationTemplateSchema
>;

export type BaseCourse = z.infer<typeof BaseCourseSchema>;
export const CourseSchemaWithAssociations = BaseCourseSchema.extend({
  outlet: BaseOutletSchema.optional(),
  level: BaseLevelSchema,
  subject: BaseSubjectSchema.optional(),
});
export type CourseWithAssociations = z.infer<
  typeof CourseSchemaWithAssociations
>;
