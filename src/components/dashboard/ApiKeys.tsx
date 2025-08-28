"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Copy, Key } from "lucide-react";
import { ApiKey } from "@/types/dashboard";
import { useNotification } from "@/hooks/useNotification";
import CreateApiKeyModal from "@/components/dashboard/modals/CreateApiKeyModal";
import ConfirmationModal from "@/components/dashboard/modals/ConfirmationModal";

interface ApiKeysProps {
  onDataUpdate: () => void;
}

export default function ApiKeys({ onDataUpdate }: ApiKeysProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/api-keys", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.data || []);
      }
    } catch (error) {
      console.error("Error loading API keys:", error);
      showNotification("Ошибка загрузки API ключей", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = () => {
    setShowCreateModal(true);
  };

  const handleKeyCreated = () => {
    setShowCreateModal(false);
    loadApiKeys();
    onDataUpdate();
    showNotification("API ключ создан успешно", "success");
  };

  const handleDeleteKey = (key: ApiKey) => {
    setKeyToDelete(key);
    setShowDeleteModal(true);
  };

  const confirmDeleteKey = async () => {
    if (!keyToDelete) return;

    try {
      const response = await fetch(
        `/api/dashboard/api-keys/${keyToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        showNotification("API ключ удален", "success");
        loadApiKeys();
        onDataUpdate();
      } else {
        throw new Error("Ошибка удаления ключа");
      }
    } catch (error: any) {
      showNotification(error.message || "Ошибка удаления ключа", "error");
    } finally {
      setShowDeleteModal(false);
      setKeyToDelete(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Скопировано в буфер обмена", "success");
    } catch (error) {
      showNotification("Ошибка копирования", "error");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">API кілттер</h2>
        <button
          onClick={handleCreateKey}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Жаңа кілт жасау
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6"
            >
              <div className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : apiKeys.length > 0 ? (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Key size={16} className="text-gray-500" />
                    <h3 className="font-semibold text-gray-900">{key.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <code className="bg-gray-200 px-3 py-1 rounded text-sm font-mono text-gray-700">
                      {key.api_key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(key.api_key)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Копировать"
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <div>
                      Создан:{" "}
                      {new Date(key.created_at).toLocaleDateString("ru-RU")}
                    </div>
                    {key.last_used_at ? (
                      <div>
                        Последнее использование:{" "}
                        {new Date(key.last_used_at).toLocaleDateString("ru-RU")}
                      </div>
                    ) : (
                      <div>Не использовался</div>
                    )}
                    {key.usage_count !== undefined && (
                      <div>
                        Использований: {key.usage_count} | Потрачено:{" "}
                        {(key.total_cost || 0).toFixed(2)} ₸
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteKey(key)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Удалить ключ"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Key size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет API ключей
          </h3>
          <p className="text-gray-500 mb-6">
            Создайте свой первый API ключ для начала работы
          </p>
          <button
            onClick={handleCreateKey}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Создать первый ключ
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateApiKeyModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleKeyCreated}
        />
      )}

      {showDeleteModal && keyToDelete && (
        <ConfirmationModal
          title="Удалить API ключ?"
          message={`Ключ "${keyToDelete.name}" будет удален навсегда.`}
          confirmText="Удалить ключ"
          onConfirm={confirmDeleteKey}
          onCancel={() => {
            setShowDeleteModal(false);
            setKeyToDelete(null);
          }}
          type="danger"
        />
      )}
    </div>
  );
}
