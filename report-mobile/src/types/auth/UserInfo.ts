import z from "zod";

export const UserInfoSchema = z.object({
  sub: z.string(),
  email_verified: z.boolean(),
  name: z.string(),
  preferred_username: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  email: z.string().email(),
});
export type UserInfo = z.infer<typeof UserInfoSchema>;
