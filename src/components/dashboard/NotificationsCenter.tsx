"use client";

import { useState } from "react";
import {
  Bell,
  X,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  CheckCheck,
  Edit,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationsCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsCenter({ isOpen, onClose }: NotificationsCenterProps) {
  const { data: notifications = [], markAsRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getIcon = (entityType: string, message: string) => {
    if (entityType === 'product' || message.includes('product') || message.includes('Stock')) {
      return <Edit className="h-5 w-5 text-blue-500" />;
    }
    if (entityType === 'order' || message.includes('Order')) {
      return <ShoppingCart className="h-5 w-5 text-emerald-500" />;
    }
    if (message.includes('increased') || message.includes('to ₦')) {
      return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    }
    if (message.includes('decreased')) {
      return <TrendingDown className="h-5 w-5 text-rose-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-amber-500" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-l-rose-500 bg-rose-50 dark:bg-rose-950/20";
      case "medium":
        return "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400"
                  disabled
                >
                  <CheckCheck className="h-4 w-4" />
                  {unreadCount} unread
                </Button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="rounded-full bg-slate-100 dark:bg-white/10 p-4">
                  <Bell className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">All caught up!</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {notifications.map((notification) => {
                  const timeSince = new Date(notification.created_at).toLocaleString();
                  
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className={`flex w-full items-start gap-4 border-l-4 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                        notification.is_read
                          ? "border-l-transparent bg-white dark:bg-transparent"
                          : getSeverityColor(notification.severity)
                      }`}
                    >
                      <div className="flex-shrink-0 pt-0.5">{getIcon(notification.related_entity_type, notification.message)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium ${notification.is_read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"}`}
                          >
                            {notification.message.split('|')[0]}
                          </p>
                          {!notification.is_read && (
                            <span className="flex h-2 w-2 flex-shrink-0 rounded-full bg-sky-500" />
                          )}
                        </div>
                        {notification.message.includes('|') && (
                          <div className="mt-2 space-y-1">
                            {notification.message.split('|').slice(1).map((change, idx) => (
                              <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
                                {change.trim()}
                              </p>
                            ))}
                          </div>
                        )}
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">{timeSince}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
            <Button
              variant="outline"
              className="w-full border-slate-200 dark:border-white/10 bg-transparent text-slate-600 dark:text-slate-400"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Notification Bell Button Component for use in dashboards
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </Button>
      <NotificationsCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
