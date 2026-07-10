import { z } from "zod";

export const profileFormSchema = z.object({
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
