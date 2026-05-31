import { z } from "zod";
import { BaseEducatorSchema } from "./Educator";
import { BaseStudentSchema } from "./Student";

export const ACCOUNT_RELATIONSHIP = ["PARENT", "SELF"] as const;

export const BaseAccountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  contact: z.string(),
  pending_account_actions: z.string().array(),
  display_roles: z.string().array(),
  relationship: z.enum(ACCOUNT_RELATIONSHIP).optional(), // only student accounts will have
});

export type BaseAccount = z.infer<typeof BaseAccountSchema>;

export const CreateBaseAccountParamsSchema = BaseAccountSchema.omit({
  id: true,
  pending_account_actions: true,
  display_roles: true,
  relationship: true,
}).extend({
  institution_id: z.string().uuid(),
});

export type CreateBaseAccountParams = z.infer<
  typeof CreateBaseAccountParamsSchema
>;

export const StudentClientSubaccountSchema = z.object({
  relationship: z.enum(ACCOUNT_RELATIONSHIP),
  students: z.lazy(() => BaseStudentSchema.array()),
});

export type StudentClientSubaccount = z.infer<
  typeof StudentClientSubaccountSchema
>;
export const EducatorClientSubaccountSchema = z.object({
  educators: z.lazy(() => BaseEducatorSchema.array()),
});
export type EducatorClientSubaccount = z.infer<
  typeof EducatorClientSubaccountSchema
>;

export const ExpandedAccountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  contact: z.string(),
  pending_account_actions: z.string().array(),
  display_roles: z.string().array(),
  student_client_subaccount: StudentClientSubaccountSchema.optional(),
  educator_client_subaccount: EducatorClientSubaccountSchema.optional(),
});
export type ExpandedAccount = z.infer<typeof ExpandedAccountSchema>;
