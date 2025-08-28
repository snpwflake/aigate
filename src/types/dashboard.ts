export interface DashboardStats {
  balance: number;
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  api_keys_count: number;
}

export interface DashboardData {
  overview: DashboardStats;
  dailyStats: any[];
  modelStats: any[];
  hourlyStats?: any[];
}

export interface ApiKey {
  id: number;
  name: string;
  api_key: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  usage_count?: number;
  total_cost?: number;
}

export interface Activity {
  type: string;
  title: string;
  value: string;
  details?: string;
  time: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  meta?: {
    model: string;
    usage: {
      total_tokens: number;
      cost_kzt: number;
    };
  };
}
