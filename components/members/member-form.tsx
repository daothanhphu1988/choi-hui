"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  memberFormSchema,
  type MemberFormValues,
} from "@/lib/validations/member.schema";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const memberStatusLabels: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Ngưng",
};

export function MemberForm({
  defaultValues,
  onSubmit,
  submitLabel = "Lưu",
}: {
  defaultValues?: Partial<MemberFormValues>;
  onSubmit: (values: MemberFormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      address: "",
      note: "",
      status: "active",
      ...defaultValues,
    },
  });

  function submit(values: MemberFormValues) {
    startTransition(async () => {
      try {
        await onSubmit(values);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.full_name}>
          <FieldLabel htmlFor="full_name">Họ tên</FieldLabel>
          <Input id="full_name" placeholder="Nguyễn Thị Lan" {...register("full_name")} />
          <FieldError errors={errors.full_name ? [errors.full_name] : undefined} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
            <Input id="phone" placeholder="0901 234 567" {...register("phone")} />
            <FieldError errors={errors.phone ? [errors.phone] : undefined} />
          </Field>

          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="status">Trạng thái</FieldLabel>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue>{(value: string) => memberStatusLabels[value]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngưng</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={errors.status ? [errors.status] : undefined} />
          </Field>
        </div>

        <Field data-invalid={!!errors.address}>
          <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
          <Input id="address" placeholder="123 Đường ABC, Quận 1" {...register("address")} />
          <FieldError errors={errors.address ? [errors.address] : undefined} />
        </Field>

        <Field data-invalid={!!errors.note}>
          <FieldLabel htmlFor="note">Ghi chú</FieldLabel>
          <Textarea id="note" rows={3} placeholder="Ghi chú thêm..." {...register("note")} />
          <FieldError errors={errors.note ? [errors.note] : undefined} />
        </Field>

        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Đang lưu..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
