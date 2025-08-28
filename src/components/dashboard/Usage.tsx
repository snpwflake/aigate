"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, Filter, Download } from "lucide-react";

interface UsageStats {
  id: number;
  model_name: string;
  endpoint: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  request_duration_ms: number;
  created_at: string;
}

interface UsageData {
  usage: UsageStats[];
  aggregated: {
    total_requests: number;
    total_tokens: number;
    total_cost: number;
    avg_duration: number;
  };
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export default function Usage() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const loadUsageData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "20",
        offset: "0",
      });

      if (selectedModel) params.append("model", selectedModel);
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);

      const response = await fetch(`/api/dashboard/usage?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsageData(data.data);
      }
    } catch (error) {
      console.error("Error loading usage data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedModel, dateFrom, dateTo]);

  useEffect(() => {
    loadUsageData();
  }, [loadUsageData]);

  const models = [
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-3.5-turbo",
    "deepseek-r1",
    "deepseek-chat",
    "claude-3.5-sonnet",
    "gemini-2.0-flash",
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Пайдалану статистикасы
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={18} />
          Экспорт
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Фильтры</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Модель
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Все модели</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              С даты
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              До даты
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Aggregated Stats */}
      {usageData?.aggregated && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Всего запросов</div>
            <div className="text-2xl font-bold text-gray-900">
              {usageData.aggregated.total_requests.toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Всего токенов</div>
            <div className="text-2xl font-bold text-gray-900">
              {usageData.aggregated.total_tokens?.toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Общая стоимость</div>
            <div className="text-2xl font-bold text-gray-900">
              {usageData.aggregated.total_cost?.toFixed(2)} ₸
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Среднее время</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(usageData.aggregated?.avg_duration)}ms
            </div>
          </div>
        </div>
      )}

      {/* Usage Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : usageData?.usage && usageData.usage.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата/Время
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Модель
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Токены
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Стоимость
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Время ответа
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usageData.usage.map((usage) => (
                  <tr key={usage.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(usage.created_at).toLocaleString("ru-RU")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {usage.model_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{usage.total_tokens.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">
                          {usage.input_tokens} + {usage.output_tokens}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usage.cost.toFixed(4)} ₸
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usage.request_duration_ms}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет данных
            </h3>
            <p className="text-gray-500">
              Статистика использования появится после первых запросов к API
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
