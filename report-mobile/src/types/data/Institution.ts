import { z } from "zod";

export const BaseInstitutionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  uen: z.string().min(1),
  address: z.string().min(1),
  contact_number: z.string().min(1),
});

export type BaseInstitution = z.infer<typeof BaseInstitutionSchema>;
