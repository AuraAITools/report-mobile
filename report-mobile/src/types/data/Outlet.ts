import { z } from "zod";
import { BaseInstitutionSchema } from "./Institution";
export const BaseOutletSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  email: z.string().email().optional(),
  postal_code: z.string(),
  contact_number: z.string(),
  description: z.string(),

  // institution: BaseInstitutionSchema.optional(),
});

export type BaseOutlet = z.infer<typeof BaseOutletSchema>;

export const OutletWithAssociationsSchema = BaseOutletSchema.extend({
  institution: BaseInstitutionSchema,
});

export type OutletWithAssociations = z.infer<
  typeof OutletWithAssociationsSchema
>;
