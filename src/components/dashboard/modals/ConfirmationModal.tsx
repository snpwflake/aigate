"use client";

import { X } from "lucide-react";

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "info" | "warning" | "danger";
}

export default function ConfirmationModal({
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  onConfirm,
  onCancel,
  type = "warning",
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (type) {
      case "info":
        return "💡";
      case "warning":
        return "⚠️";
      case "danger":
        return "🗑️";
      default:
        return "❓";
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case "info":
        return "bg-blue-600 hover:bg-blue-700";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-primary-600 hover:bg-primary-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">{getIcon()}</div>
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${getConfirmButtonClass()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
