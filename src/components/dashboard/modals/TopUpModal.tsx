"use client";

import { useState } from "react";
import { X, CreditCard } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

interface TopUpModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TopUpModal({ onClose, onSuccess }: TopUpModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount)) {
      setError("Введите корректную сумму");
      return;
    }

    if (numAmount < 1) {
      setError("Минимальная сумма: 1 ₸");
      return;
    }

    if (numAmount > 50000) {
      setError("Максимальная сумма: 50,000 ₸");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/balance/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ amount: numAmount }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(`Баланс пополнен на ${amount} ₸`, "success");
        onSuccess();
      } else {
        throw new Error(data.message || "Ошибка пополнения баланса");
      }
    } catch (error: any) {
      setError(error.message || "Ошибка пополнения баланса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Пополнить баланс
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сумма пополнения (₸)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                min="1"
                max="50000"
                step="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Test Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 text-lg">💡</span>
                <div className="text-sm text-blue-800">
                  <strong>Это тестовая функция.</strong> В реальной системе
                  здесь будет интеграция с платежными системами.
                </div>
              </div>
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
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  "Пополнение..."
                ) : (
                  <>
                    <CreditCard size={16} />
                    Пополнить
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
