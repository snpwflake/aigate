import { DashboardStats } from "@/types/dashboard";

interface StatsGridProps {
  stats?: DashboardStats;
  loading: boolean;
}

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  const statItems = [
    {
      title: "API сұраулар",
      shortTitle: "Сұраулар", // Короткий заголовок для мобилки
      value: stats?.total_requests || 0,
      label: "Барлығы",
      format: (val: number) => val.toLocaleString(),
      icon: "📊",
    },
    {
      title: "Токендер",
      shortTitle: "Токендер",
      value: stats?.total_tokens || 0,
      label: "Пайдаланылған",
      format: (val: number) => {
        // На мобилке сокращаем большие числа
        if (window.innerWidth < 768 && val >= 1000000) {
          return (val / 1000000).toFixed(1) + "M";
        } else if (window.innerWidth < 768 && val >= 1000) {
          return (val / 1000).toFixed(1) + "K";
        }
        return val.toLocaleString();
      },
      icon: "🔤",
    },
    {
      title: "Шығын",
      shortTitle: "Шығын",
      value: stats?.total_cost || 0,
      label: "₸",
      format: (val: number) => val.toFixed(2),
      icon: "💰",
    },
    {
      title: "API кілттер",
      shortTitle: "Кілттер",
      value: stats?.api_keys_count || 0,
      label: "Белсенді",
      format: (val: number) => val.toString(),
      icon: "🔑",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-sm border-l-4 border-l-primary-500"
          >
            <div className="animate-pulse">
              <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 mb-2 md:mb-4"></div>
              <div className="h-5 md:h-8 bg-gray-200 rounded w-1/2 mb-1 md:mb-2"></div>
              <div className="h-2 md:h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
      {statItems.map((item) => (
        <div
          key={item.title}
          className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-sm border-l-4 border-l-primary-500 hover:shadow-md transition-shadow"
        >
          {/* Заголовок с иконкой на мобилке */}
          <div className="flex items-center gap-1 md:gap-0 mb-2 md:mb-4">
            <span className="text-sm md:hidden">{item.icon}</span>
            <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
              <span className="md:hidden">{item.shortTitle}</span>
              <span className="hidden md:block">{item.title}</span>
            </h3>
          </div>

          {/* Значение - адаптивный размер */}
          <div className="text-lg md:text-3xl font-bold text-gray-900 mb-1 leading-tight">
            {item.format(item.value)}
          </div>

          {/* Лейбл - меньше на мобилке */}
          <div className="text-xs md:text-sm text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
