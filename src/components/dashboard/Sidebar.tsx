"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  BarChart3,
  Key,
  Activity,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

const menuItems = [
  { id: "chat", label: "Чат", icon: MessageSquare },
  { id: "overview", label: "Басты бет", icon: BarChart3 },
  { id: "api-keys", label: "API кілттер", icon: Key },
  { id: "usage", label: "Пайдалану", icon: Activity },
  { id: "billing", label: "Төлемдер", icon: CreditCard },
  { id: "settings", label: "Баптаулар", icon: Settings },
];

export default function Sidebar({
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Закрываем мобильное меню при изменении секции
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Закрываем меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const menuButton = document.getElementById("mobile-menu-button");

      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Закрываем меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showNotification("Вы вышли из системы", "success");
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showNotification("Ошибка при выходе", "error");
    }
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 h-[84px] flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          AIGATE
        </h2>
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                isActive
                  ? "bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Шығу</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all"
        aria-label="Открыть меню"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm h-screen sticky top-0">
        <SidebarContent />
      </nav>

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 md:hidden ${
              isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Sidebar */}
          <nav
            id="mobile-sidebar"
            className={`fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </nav>
        </>
      )}
    </>
  );
}
