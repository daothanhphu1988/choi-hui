"use client";

import { useState, type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MemberForm } from "@/components/members/member-form";
import type { MemberFormValues } from "@/lib/validations/member.schema";

interface MemberFormDialogProps {
  title: string;
  defaultValues?: Partial<MemberFormValues>;
  onSubmit: (values: MemberFormValues) => Promise<void>;
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MemberFormDialog({
  title,
  defaultValues,
  onSubmit,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: MemberFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = onOpenChangeProp ?? setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MemberForm
          defaultValues={defaultValues}
          onSubmit={async (values) => {
            await onSubmit(values);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
