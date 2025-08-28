"use client";

import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { NotificationType } from "@/hooks/useNotification";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export default function NotificationContainer({
  notifications,
  onRemove,
}: NotificationContainerProps) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <XCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "info":
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "info":
      default:
        return "bg-blue-500 text-white";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${getStyles(
            notification.type
          )}`}
          style={{ animation: "slideInRight 0.3s ease-out" }}
        >
          {getIcon(notification.type)}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => onRemove(notification.id)}
            className="ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
