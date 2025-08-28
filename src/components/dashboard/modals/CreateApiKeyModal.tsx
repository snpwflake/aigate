"use client";

import { useState } from "react";
import { X, Key, Copy } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

interface CreateApiKeyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateApiKeyModal({
  onClose,
  onSuccess,
}: CreateApiKeyModalProps) {
  const [step, setStep] = useState<"create" | "display">("create");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState("");
  const [error, setError] = useState("");
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Название ключа обязательно");
      return;
    }

    if (name.trim().length < 3) {
      setError("Название должно содержать минимум 3 символа");
      return;
    }

    if (name.trim().length > 50) {
      setError("Название не должно превышать 50 символов");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setCreatedKey(data.data.api_key);
        setStep("display");
      } else {
        throw new Error(data.message || "Ошибка создания API ключа");
      }
    } catch (error: any) {
      setError(error.message || "Ошибка создания API ключа");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(createdKey);
      showNotification("API ключ скопирован", "success");
    } catch (error) {
      showNotification("Ошибка копирования", "error");
    }
  };

  const handleClose = () => {
    if (step === "display") {
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {step === "create"
              ? "Создать новый API ключ"
              : "Ваш новый API ключ"}
          </h3>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === "create" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название ключа
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Production Key"
                  maxLength={50}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Создание..." : "Создать ключ"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <Key size={20} />
                <span className="font-medium">API ключ успешно создан!</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API ключ:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={createdKey}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    title="Копировать"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                  <div className="text-sm text-yellow-800">
                    <strong>Важно!</strong> Сохраните этот ключ в безопасном
                    месте. По соображениям безопасности мы не сможем показать
                    его снова.
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Понятно
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
