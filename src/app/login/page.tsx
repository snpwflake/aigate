"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, login } = useAuth();
  const { showNotification } = useNotification();

  // Проверка существующей авторизации
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("🔄 User already authenticated, redirecting to dashboard...");
      showNotification("Вы уже авторизованы", "info");

      const from = searchParams.get("from") || "/dashboard";
      setTimeout(() => {
        router.push(from);
      }, 1000);
    }
  }, [isAuthenticated, isLoading, router, searchParams, showNotification]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const showFieldError = (fieldName: string, message: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: message }));
  };

  const validateForm = (): boolean => {
    clearErrors();
    let hasErrors = false;

    if (!formData.email) {
      showFieldError("email", "Email міндетті");
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      showFieldError("email", "Дұрыс email енгізіңіз");
      hasErrors = true;
    }

    if (!formData.password) {
      showFieldError("password", "Пароль міндетті");
      hasErrors = true;
    }

    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        showNotification("Сәтті кірдіңіз!", "success");

        const from = searchParams.get("from") || "/dashboard";
        setTimeout(() => {
          router.push(from);
        }, 1000);
      } else {
        if (result.errors) {
          result.errors.forEach((error: any) => {
            showFieldError(error.path || error.param, error.msg);
          });
        } else {
          showNotification(result.message, "error");
        }
      }
    } catch (error) {
      showNotification("Сервер қатесі. Қайталап көріңіз.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-500 to-accent-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-500 to-accent-500 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary-500 to-accent-500 bg-clip-text text-transparent mb-2">
              AIGATE
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Кіру</h2>
            <p className="text-gray-600">Өз аккаунтыңызға кіріңіз</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3.5 border-2 rounded-xl text-base transition-all focus:outline-none ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100"
                }`}
              />
              <span className="text-red-500 text-xs mt-1 block min-h-[16px]">
                {errors.email || ""}
              </span>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Пароліңізді енгізіңіз"
                  className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-base transition-all focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors opacity-60 hover:opacity-100"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <span className="text-red-500 text-xs mt-1 block min-h-[16px]">
                {errors.password || ""}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-r from-secondary-500 to-accent-500 text-white rounded-xl text-base font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-secondary-200 relative overflow-hidden ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:-translate-y-0.5 hover:shadow-lg"
              }`}
            >
              <span className={loading ? "invisible" : "visible"}>Кіру</span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  Кіру...
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative bg-white px-4">
              <span className="text-gray-500 text-sm">немесе</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Аккаунтыңыз жоқ па?{" "}
              <Link
                href="/register"
                className="text-secondary-500 font-medium hover:underline"
              >
                Тіркелу
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
