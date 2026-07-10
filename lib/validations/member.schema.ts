import { z } from "zod";

export const memberFormSchema = z.object({
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
