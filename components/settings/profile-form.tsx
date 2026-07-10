"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/lib/validations/profile.schema";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateOwnProfile } from "@/lib/actions/profile";

export function ProfileForm({ defaultValues }: { defaultValues: ProfileFormValues }) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function submit(values: ProfileFormValues) {
    startTransition(async () => {
      try {
        await updateOwnProfile(values);
        toast.success("Đã cập nhật hồ sơ");
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
          <Input id="full_name" {...register("full_name")} />
          <FieldError errors={errors.full_name ? [errors.full_name] : undefined} />
        </Field>
        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
          <Input id="phone" {...register("phone")} />
          <FieldError errors={errors.phone ? [errors.phone] : undefined} />
        </Field>
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </FieldGroup>
    </form>
  );
}
