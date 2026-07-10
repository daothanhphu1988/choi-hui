"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/utils/dates";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/actions/notifications";
import type { NotificationRow } from "@/lib/supabase/types";

export function NotificationBell({
  notifications,
}: {
  notifications: NotificationRow[];
}) {
  const [pending, startTransition] = useTransition();
  const unread = notifications.filter((n) => !n.is_read);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="size-4" />
            {unread.length > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {unread.length > 9 ? "9+" : unread.length}
              </span>
            ) : null}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-80 gap-0 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <p className="text-sm font-medium">Thông báo</p>
          {unread.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => startTransition(() => markAllNotificationsRead())}
            >
              Đánh dấu đã đọc
            </Button>
          ) : null}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length ? (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() =>
                  startTransition(() => markNotificationRead(notification.id))
                }
                className={`flex w-full flex-col items-start gap-0.5 border-b px-3 py-2.5 text-left text-sm transition-colors last:border-0 hover:bg-muted/50 ${
                  !notification.is_read ? "bg-primary/5" : ""
                }`}
              >
                <span className="font-medium">{notification.title}</span>
                {notification.body ? (
                  <span className="text-xs text-muted-foreground">
                    {notification.body}
                  </span>
                ) : null}
                <span className="text-[11px] text-muted-foreground">
                  {formatRelative(notification.created_at)}
                </span>
              </button>
            ))
          ) : (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Không có thông báo nào
            </p>
          )}
        </div>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            nativeButton={false}
            render={<Link href="/notifications" />}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
