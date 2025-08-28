"use client";

import { useState, useEffect } from "react";
import { Plus, Activity, TrendingUp, Link } from "lucide-react";
import { DashboardData, Activity as ActivityType } from "@/types/dashboard";
import { useNotification } from "@/hooks/useNotification";
import CreateApiKeyModal from "@/components/dashboard/modals/CreateApiKeyModal";

interface OverviewProps {
  dashboardData: DashboardData | null;
  onDataUpdate: () => void;
}

export default function Overview({
  dashboardData,
  onDataUpdate,
}: OverviewProps) {
  const [recentActivity, setRecentActivity] = useState<ActivityType[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setActivityLoading(true);
      const response = await fetch("/api/dashboard/activity?limit=5", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.data || []);
      }
    } catch (error) {
      console.error("Error loading activity:", error);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleCreateApiKey = () => {
    setShowCreateModal(true);
  };

  const handleApiKeyCreated = () => {
    setShowCreateModal(false);
    onDataUpdate();
    loadRecentActivity();
    showNotification("API ключ создан успешно", "success");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Шолу</h2>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Жылдам әрекеттер
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleCreateApiKey}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Жаңа API кілт
          </button>

          <a
            href="mailto:contact@aigate.kz"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <TrendingUp size={20} />
            Баланс толтыру
          </a>

          <a
            href="/#faq"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            📚 Құжаттама
          </a>
        </div>
      </div>

      {/* Charts Section */}
      {dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Usage Chart */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Күнделікті пайдалану
            </h3>
            <div className="h-48 flex items-end justify-center gap-2">
              {dashboardData.dailyStats &&
              dashboardData.dailyStats.length > 0 ? (
                dashboardData.dailyStats
                  .slice(0, 7)
                  .reverse()
                  .map((stat, index) => {
                    const maxCost = Math.max(
                      ...dashboardData.dailyStats.map((s) => parseFloat(s.cost))
                    );
                    const height = Math.max(
                      (parseFloat(stat.cost) / maxCost) * 160,
                      4
                    );

                    return (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-primary-600 to-purple-600 rounded-t-md w-8 hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ height: `${height}px` }}
                        title={`${new Date(stat.date).toLocaleDateString(
                          "ru-RU"
                        )}: ${parseFloat(stat.cost).toFixed(2)} ₸`}
                      />
                    );
                  })
              ) : (
                <p className="text-gray-500">Нет данных за последние дни</p>
              )}
            </div>
          </div>

          {/* Models Usage Chart */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Модельдер бойынша
            </h3>
            <div className="space-y-3">
              {dashboardData.modelStats &&
              dashboardData.modelStats.length > 0 ? (
                dashboardData.modelStats.slice(0, 5).map((stat, index) => {
                  const maxCost = Math.max(
                    ...dashboardData.modelStats.map((s) => parseFloat(s.cost))
                  );
                  const percentage = (parseFloat(stat.cost) / maxCost) * 100;

                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {stat.model_name}
                        </span>
                        <span className="text-gray-600">
                          {parseFloat(stat.cost).toFixed(2)} ₸
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">
                  Нет данных по использованию моделей
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={20} className="text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Соңғы белсенділік
          </h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {activityLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex justify-between items-center"
                  >
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {activity.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                    <div className="font-semibold text-primary-600">
                      {activity.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Пока нет активности
            </div>
          )}
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <CreateApiKeyModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleApiKeyCreated}
        />
      )}
    </div>
  );
}
