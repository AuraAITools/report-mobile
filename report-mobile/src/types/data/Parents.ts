import { z } from "zod";
import { ACCOUNT_RELATIONSHIP } from "./Account";
import { BaseStudentSchema } from "./Student";

export const BaseParentClientAccountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  contact: z.string(),
  relationship: z.enum(ACCOUNT_RELATIONSHIP),
  students: BaseStudentSchema.array(),
});

export type BaseParentClientAccount = z.infer<
  typeof BaseParentClientAccountSchema
>;
