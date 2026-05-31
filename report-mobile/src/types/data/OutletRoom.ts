import { z } from "zod";

export const BaseOutletRoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
  image: z.string().optional(),
  size: z.number().min(1).max(200),
  details: z.string(),
});

export type BaseOutletRoom = z.infer<typeof BaseOutletRoomSchema>;
