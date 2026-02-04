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
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notifications as initialNotifications, type Notification } from "@/lib/mock-data";

interface NotificationsCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsCenter({ isOpen, onClose }: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "low-stock":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "out-of-stock":
        return <Package className="h-5 w-5 text-rose-500" />;
      case "new-order":
        return <ShoppingCart className="h-5 w-5 text-emerald-500" />;
      case "revenue":
        return <DollarSign className="h-5 w-5 text-sky-500" />;
      case "anomaly":
        return <AlertCircle className="h-5 w-5 text-rose-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getSeverityColor = (severity: Notification["severity"]) => {
    switch (severity) {
      case "critical":
        return "border-l-rose-500 bg-rose-50";
      case "warning":
        return "border-l-amber-500 bg-amber-50";
      default:
        return "border-l-sky-500 bg-sky-50";
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
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-sky-600 hover:text-sky-700"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all read
                </Button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="rounded-full bg-slate-100 p-4">
                  <Bell className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">All caught up!</h3>
                <p className="mt-1 text-sm text-slate-500">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className={`flex w-full items-start gap-4 border-l-4 p-4 text-left transition-colors hover:bg-slate-50 ${
                      notification.read
                        ? "border-l-transparent bg-white"
                        : getSeverityColor(notification.severity)
                    }`}
                  >
                    <div className="flex-shrink-0 pt-0.5">{getIcon(notification.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`font-medium ${notification.read ? "text-slate-600" : "text-slate-900"}`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 rounded-full bg-sky-500 h-2 w-2" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                      <p className="mt-2 text-xs text-slate-400">{notification.timestamp}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 p-4">
            <Button
              variant="outline"
              className="w-full border-slate-200 bg-transparent text-slate-600"
            >
              View All Activity
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
  const unreadCount = initialNotifications.filter((n) => !n.read).length;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-5 w-5 text-slate-600" />
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
