"use client";

import { createContext, useContext, ReactNode } from "react";
import { useNotification, NotificationType } from "@/hooks/useNotification";
import NotificationContainer from "./NotificationContainer";

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { notifications, showNotification, removeNotification } =
    useNotification();

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return context;
}

// Экспортируем хук для удобства
export { useNotification };
