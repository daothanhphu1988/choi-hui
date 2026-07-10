"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  chainFormSchema,
  type ChainFormValues,
  type ChainFormInput,
} from "@/lib/validations/chain.schema";
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
import { cycleLabels } from "@/lib/utils/dates";

const chainTypeLabels: Record<string, string> = {
  khong_lai: "Không lãi (bốc thăm)",
  lai: "Có lãi (đấu giá)",
};

export function ChainForm({
  defaultValues,
  onSubmit,
  submitLabel = "Lưu dây hụi",
}: {
  defaultValues?: Partial<ChainFormValues>;
  onSubmit: (values: ChainFormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChainFormInput, unknown, ChainFormValues>({
    resolver: zodResolver(chainFormSchema),
    defaultValues: {
      name: "",
      type: "khong_lai",
      share_value: 0,
      cycle: "monthly",
      start_date: "",
      total_shares: 10,
      note: "",
      ...defaultValues,
    },
  });

  function submit(values: ChainFormValues) {
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
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Tên dây hụi</FieldLabel>
          <Input
            id="name"
            placeholder="Hụi tháng 12 chị Lan"
            {...register("name")}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.type}>
            <FieldLabel htmlFor="type">Loại hụi</FieldLabel>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue>{(value: string) => chainTypeLabels[value]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="khong_lai">
                      Không lãi (bốc thăm)
                    </SelectItem>
                    <SelectItem value="lai">Có lãi (đấu giá)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={errors.type ? [errors.type] : undefined} />
          </Field>

          <Field data-invalid={!!errors.cycle}>
            <FieldLabel htmlFor="cycle">Chu kỳ</FieldLabel>
            <Controller
              control={control}
              name="cycle"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="cycle" className="w-full">
                    <SelectValue>{(value: string) => cycleLabels[value as keyof typeof cycleLabels]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(cycleLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={errors.cycle ? [errors.cycle] : undefined} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.share_value}>
            <FieldLabel htmlFor="share_value">
              Giá trị 1 phần hụi (VNĐ)
            </FieldLabel>
            <Input
              id="share_value"
              type="number"
              min={0}
              step={100000}
              {...register("share_value")}
            />
            <FieldError
              errors={errors.share_value ? [errors.share_value] : undefined}
            />
          </Field>

          <Field data-invalid={!!errors.total_shares}>
            <FieldLabel htmlFor="total_shares">Tổng số phần</FieldLabel>
            <Input
              id="total_shares"
              type="number"
              min={1}
              step={1}
              {...register("total_shares")}
            />
            <FieldError
              errors={errors.total_shares ? [errors.total_shares] : undefined}
            />
          </Field>
        </div>

        <Field data-invalid={!!errors.start_date}>
          <FieldLabel htmlFor="start_date">Ngày mở hụi</FieldLabel>
          <Input id="start_date" type="date" {...register("start_date")} />
          <FieldError
            errors={errors.start_date ? [errors.start_date] : undefined}
          />
        </Field>

        <Field data-invalid={!!errors.note}>
          <FieldLabel htmlFor="note">
            Ghi chú / quy định chia tiền bỏ hụi
          </FieldLabel>
          <Textarea
            id="note"
            rows={3}
            placeholder="Ví dụ: chia đều cho các phần chưa hốt"
            {...register("note")}
          />
          <FieldError errors={errors.note ? [errors.note] : undefined} />
        </Field>

        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Đang lưu..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
