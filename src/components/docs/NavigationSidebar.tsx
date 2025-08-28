"use client";

import Link from "next/link";

interface NavigationItem {
  id: string;
  title: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  { id: "overview", title: "Шолу", icon: "📋" },
  { id: "auth", title: "Авторизация", icon: "🔐" },
  { id: "openai-api", title: "OpenAI API", icon: "🤖" },
  { id: "balance-api", title: "Баланс API", icon: "💰" },
  { id: "web-chat", title: "Веб-чат", icon: "🌐" },
  { id: "rate-limits", title: "Лимиттер", icon: "⚡" },
  { id: "errors", title: "Қателер", icon: "❌" },
  { id: "examples", title: "Мысалдар", icon: "🔧" },
  { id: "sdk-examples", title: "SDK мысалдары", icon: "📦" },
];

interface NavigationSidebarProps {
  activeSection: string;
}

export default function NavigationSidebar({
  activeSection,
}: NavigationSidebarProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className={"w-64 "}>
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
        <h3 className="font-semibold text-gray-900 mb-4 ">Мазмұны</h3>
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                  activeSection === item.id
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Жылдам сілтемелер</h4>
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="block text-sm text-primary-600 hover:text-primary-700 hover:underline"
            >
              🔑 Dashboard
            </Link>
            <Link
              href="/#faq"
              className="block text-sm text-primary-600 hover:text-primary-700 hover:underline"
            >
              ❓ FAQ
            </Link>
            <Link
              href="mailto:contact@aigate.kz"
              className="block text-sm text-primary-600 hover:text-primary-700 hover:underline"
            >
              📧 Қолдау көрсету
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
