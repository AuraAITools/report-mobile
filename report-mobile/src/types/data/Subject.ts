import { z } from "zod";

export const BaseSubjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export type BaseSubject = z.infer<typeof BaseSubjectSchema>;
