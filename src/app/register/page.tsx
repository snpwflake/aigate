"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { id: "length", label: "Кемінде 6 символ", test: (p) => p.length >= 6 },
  { id: "lowercase", label: "Кіші әріп", test: (p) => /[a-z]/.test(p) },
  { id: "uppercase", label: "Бас әріп", test: (p) => /[A-Z]/.test(p) },
  { id: "number", label: "Сан", test: (p) => /\d/.test(p) },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState<
    Record<string, boolean>
  >({});

  const router = useRouter();
  const { isAuthenticated, isLoading, register } = useAuth();
  const { showNotification } = useNotification();

  // Проверка существующей авторизации
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("🔄 User already authenticated, redirecting to dashboard...");
      showNotification("Вы уже авторизованы", "info");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  }, [isAuthenticated, isLoading, router, showNotification]);

  // Проверка требований к паролю в реальном времени
  useEffect(() => {
    const requirements: Record<string, boolean> = {};
    passwordRequirements.forEach((req) => {
      requirements[req.id] = req.test(formData.password);
    });
    setPasswordRequirementsMet(requirements);
  }, [formData.password]);

  // Проверка совпадения паролей
  useEffect(() => {
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Парольдер сәйкес келмейді",
      }));
    } else if (
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    ) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  }, [formData.password, formData.confirmPassword]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return passwordRequirements.every((req) => req.test(password));
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

    if (!formData.name.trim()) {
      showFieldError("name", "Аты міндетті");
      hasErrors = true;
    } else if (formData.name.trim().length < 2) {
      showFieldError("name", "Аты кемінде 2 символ болуы керек");
      hasErrors = true;
    }

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
    } else if (!validatePassword(formData.password)) {
      showFieldError(
        "password",
        "Пароль барлық талаптарды қанағаттандыруы керек"
      );
      hasErrors = true;
    }

    if (formData.password !== formData.confirmPassword) {
      showFieldError("confirmPassword", "Парольдер сәйкес келмейді");
      hasErrors = true;
    }

    if (!formData.terms) {
      showFieldError("terms", "Шарттарды қабылдау міндетті");
      hasErrors = true;
    }

    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form submitted");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password
      );

      if (result.success) {
        showNotification("Тіркелу сәтті аяқталды!", "success");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Тіркелу
            </h2>
            <p className="text-gray-600">Жаңа аккаунт жасаңыз</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Толық аты
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Атыңызды енгізіңіз"
                className={`w-full px-4 py-3.5 border-2 rounded-xl text-base transition-all focus:outline-none ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100"
                }`}
              />
              <span className="text-red-500 text-xs mt-1 block min-h-[16px]">
                {errors.name || ""}
              </span>
            </div>

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
                  placeholder="Кемінде 6 символ"
                  className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-base transition-all focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors opacity-60 hover:opacity-100"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-200">
                <small className="text-gray-600 block mb-2">
                  Пароль міндетті түрде мыналарды қамтуы керек:
                </small>
                <ul className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <li
                      key={req.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      {passwordRequirementsMet[req.id] ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                      <span
                        className={
                          passwordRequirementsMet[req.id]
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <span className="text-red-500 text-xs mt-1 block min-h-[16px]">
                {errors.password || ""}
              </span>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Парольді растау
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Парольді қайталаңыз"
                  className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-base transition-all focus:outline-none ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                      ? "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                      : "border-gray-200 focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors opacity-60 hover:opacity-100"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <span className="text-red-500 text-xs mt-1 block min-h-[16px]">
                {errors.confirmPassword || ""}
              </span>
            </div>

            {/* Terms Checkbox */}
            <div className="my-6">
              <label className="flex items-start cursor-pointer text-sm leading-relaxed">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                      formData.terms
                        ? "bg-secondary-500 border-secondary-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.terms && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-gray-600">
                  Мен{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-secondary-500 hover:underline"
                  >
                    Пайдаланушы келісімімен
                  </Link>{" "}
                  және{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-secondary-500 hover:underline"
                  >
                    Құпиялылық саясатымен
                  </Link>{" "}
                  келісемін
                </span>
              </label>
              <span className="text-red-500 text-xs mt-1 block">
                {errors.terms || ""}
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
              <span className={loading ? "invisible" : "visible"}>Тіркелу</span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  Тіркелуде...
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
              Аккаунтыңыз бар ма?{" "}
              <Link
                href="/login"
                className="text-secondary-500 font-medium hover:underline"
              >
                Кіру
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
