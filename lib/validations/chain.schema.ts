import { z } from "zod";

export const chainFormSchema = z.object({
  name: z.string().min(2, "Tên dây hụi phải có ít nhất 2 ký tự"),
  type: z.enum(["lai", "khong_lai"]),
  share_value: z.coerce.number().positive("Giá trị phần hụi phải lớn hơn 0"),
  cycle: z.enum(["weekly", "biweekly", "monthly"]),
  start_date: z.string().min(1, "Vui lòng chọn ngày mở hụi"),
  total_shares: z.coerce
    .number()
    .int()
    .positive("Tổng số phần phải lớn hơn 0"),
  note: z.string().optional(),
});

export type ChainFormValues = z.output<typeof chainFormSchema>;
export type ChainFormInput = z.input<typeof chainFormSchema>;
