"use client";

import { useState, useEffect, useCallback } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const secure = location.protocol === "https:" ? "; Secure" : "";
  const sameSite = "; SameSite=Strict";

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/${secure}${sameSite}`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Функция для сохранения данных авторизации
  const saveAuthData = useCallback((token: string, user: User) => {
    console.log("💾 Saving auth data...");

    // Сохраняем в localStorage (для совместимости)
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Сохраняем токен в cookies (более безопасно)
    setCookie("token", token, 7); // 7 дней
    setCookie("user", JSON.stringify(user), 7);

    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });

    console.log("✅ Auth data saved to localStorage and cookies");
  }, []);

  // Функция для очистки данных авторизации
  const clearAuthData = useCallback(() => {
    console.log("🗑️ Clearing auth data...");

    // Очищаем localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Очищаем cookies
    deleteCookie("token");
    deleteCookie("user");

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    console.log("✅ Auth data cleared");
  }, []);

  // Функция для получения токена
  const getAuthToken = useCallback((): string | null => {
    // Сначала пробуем localStorage, потом cookies
    return localStorage.getItem("token") || getCookie("token");
  }, []);

  // Функция для получения данных пользователя
  const getAuthUser = useCallback((): User | null => {
    const userFromLS = localStorage.getItem("user");
    const userFromCookie = getCookie("user");

    try {
      if (userFromLS) {
        return JSON.parse(userFromLS);
      } else if (userFromCookie) {
        return JSON.parse(userFromCookie);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      clearAuthData();
    }

    return null;
  }, [clearAuthData]);

  // Проверка авторизации
  const checkAuthStatus = useCallback(() => {
    const token = getAuthToken();
    const user = getAuthUser();

    if (token && user) {
      try {
        // Простая проверка токена (декодируем payload)
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (tokenData.exp && tokenData.exp > currentTime) {
          console.log("👤 User is authenticated:", user.email);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
          });
          return { token, user, isValid: true };
        } else {
          console.log("⏰ Token expired");
          clearAuthData();
          return { isValid: false };
        }
      } catch (error) {
        console.log("❌ Invalid token format");
        clearAuthData();
        return { isValid: false };
      }
    }

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    return { isValid: false };
  }, [getAuthToken, getAuthUser, clearAuthData]);

  // Функция логина
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        console.log("🔄 Sending login request...");
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        console.log("📥 Login response:", result);

        if (result.success) {
          saveAuthData(result.data.token, result.data.user);
          return { success: true, data: result.data };
        } else {
          return {
            success: false,
            message: result.message,
            errors: result.errors,
          };
        }
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Сервер қатесі. Қайталап көріңіз." };
      }
    },
    [saveAuthData]
  );

  // Функция регистрации
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        console.log("🔄 Sending register request...");
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name: name.trim(), email, password }),
        });

        const result = await response.json();
        console.log("📥 Register response:", result);

        if (result.success) {
          saveAuthData(result.data.token, result.data.user);
          return { success: true, data: result.data };
        } else {
          return {
            success: false,
            message: result.message,
            errors: result.errors,
          };
        }
      } catch (error) {
        console.error("Register error:", error);
        return { success: false, message: "Сервер қатесі. Қайталап көріңіз." };
      }
    },
    [saveAuthData]
  );

  // Функция выхода
  const logout = useCallback(async () => {
    console.log("🚪 Logging out...");

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
    }
  }, [clearAuthData]);

  // Проверка авторизации при загрузке
  useEffect(() => {
    checkAuthStatus();
    setIsLoading(false);
  }, [checkAuthStatus]);

  return {
    ...authState,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
    saveAuthData,
    clearAuthData,
  };
}
