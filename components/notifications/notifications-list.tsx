"use client";

import { useTransition } from "react";
import { BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils/dates";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/actions/notifications";
import type { NotificationRow } from "@/lib/supabase/types";

export function NotificationsList({
  notifications,
}: {
  notifications: NotificationRow[];
}) {
  const [pending, startTransition] = useTransition();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!notifications.length) {
    return (
      <EmptyState
        icon={BellOff}
        title="Chưa có thông báo nào"
        description="Thông báo về kỳ hụi, đóng tiền sẽ xuất hiện tại đây."
      />
    );
  }

  return (
    <div className="space-y-3">
      {unreadCount > 0 ? (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => startTransition(() => markAllNotificationsRead())}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      ) : null}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() =>
              !notification.is_read &&
              startTransition(() => markNotificationRead(notification.id))
            }
            className={`flex w-full flex-col items-start gap-1 rounded-lg border p-4 text-left text-sm transition-colors hover:bg-muted/50 ${
              !notification.is_read ? "border-primary/30 bg-primary/5" : ""
            }`}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="font-medium">{notification.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(notification.created_at, "dd/MM/yyyy HH:mm")}
              </span>
            </div>
            {notification.body ? (
              <span className="text-muted-foreground">{notification.body}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
