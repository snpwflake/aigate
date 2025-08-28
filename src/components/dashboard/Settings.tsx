"use client";

import { useState } from "react";
import { User, Lock, Trash2 } from "lucide-react";
import ConfirmationModal from "./modals/ConfirmationModal";
import { useNotification } from "@/hooks/useNotification";
import { User as UserType } from "@/lib/auth";

interface SettingsProps {
  user: UserType;
}

export default function Settings({ user }: SettingsProps) {
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showNotification("Введите имя", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        // Update localStorage
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.name = name.trim();
        localStorage.setItem("user", JSON.stringify(userData));

        showNotification("Профиль обновлен", "success");
      } else {
        throw new Error(data.message || "Ошибка обновления профиля");
      }
    } catch (error: any) {
      showNotification(error.message || "Ошибка обновления профиля", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification("Заполните все поля", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("Пароли не совпадают", "error");
      return;
    }

    if (newPassword.length < 6) {
      showNotification("Пароль должен содержать минимум 6 символов", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showNotification("Пароль изменен успешно", "success");
      } else {
        throw new Error(data.message || "Ошибка изменения пароля");
      }
    } catch (error: any) {
      showNotification(error.message || "Ошибка изменения пароля", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    showNotification("Функция удаления аккаунта в разработке", "info");
    setShowDeleteModal(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Баптаулар</h2>
      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Профиль</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Изменить пароль
            </h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текущий пароль
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Изменение..." : "Изменить пароль"}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 size={20} className="text-red-600" />
            <h3 className="text-lg font-medium text-red-900">Қауіпті аймақ</h3>
          </div>

          <p className="text-red-700 mb-4">
            Удаление аккаунта приведет к безвозвратной потере всех данных.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Удалить аккаунт
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          title="Удалить аккаунт?"
          message="Все данные будут удалены навсегда. Это действие нельзя отменить."
          confirmText="Удалить аккаунт"
          onConfirm={confirmDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          type="danger"
        />
      )}
    </div>
  );
}
