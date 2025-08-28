"use client";

import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, DollarSign, Link } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

interface Transaction {
  id: number;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  created_at: string;
}

interface BillingProps {
  balance: number;
  onDataUpdate: () => void;
}

export default function Billing({ balance, onDataUpdate }: BillingProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/transactions?limit=10", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data.transactions || []);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return "💰";
      case "usage":
        return "🤖";
      case "refund":
        return "↩️";
      case "bonus":
        return "🎁";
      default:
        return "💳";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "refund":
      case "bonus":
        return "text-green-600";
      case "usage":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = ["deposit", "refund", "bonus"].includes(type) ? "+" : "-";
    return `${prefix}${amount.toFixed(2)} ₸`;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Төлемдер</h2>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-8 text-white mb-8 max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={24} />
          <h3 className="text-lg font-medium">Ағымдағы баланс</h3>
        </div>

        <div className="text-4xl font-bold mb-6">{balance.toFixed(2)} ₸</div>

        <a
          href="mailto:contact@aigate.kz"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <TrendingUp size={18} />
          Толтыру
        </a>
      </div>

      {/* Payment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">
              Как пополнить баланс?
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              Для пополнения баланса напишите нам на электронную почту с
              указанием суммы пополнения.
            </p>
            <div className="space-y-1 text-sm text-blue-700">
              <div>
                📧 Email: <strong>contact@aigate.kz</strong>
              </div>
              <div>
                💳 Принимаем: Kaspi, банковские карты, банковские переводы
              </div>
              <div>⚡ Зачисление: в течение 1-2 часов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <DollarSign size={20} className="text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            История транзакций
          </h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleString(
                            "ru-RU"
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          Баланс: {transaction.balance_before.toFixed(2)} →{" "}
                          {transaction.balance_after.toFixed(2)} ₸
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${getTransactionColor(
                        transaction.transaction_type
                      )}`}
                    >
                      {formatAmount(
                        transaction.amount,
                        transaction.transaction_type
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Нет транзакций
              </h3>
              <p className="text-gray-500">
                История транзакций появится после первых операций
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
