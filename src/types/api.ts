export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost_kzt: number;
  };
}

export interface OpenAIError {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
}

export const MODEL_PRICING = {
  "gpt-4o-mini": { input: 27, output: 108 },
  "gpt-4o": { input: 450, output: 1800 },
  "gpt-3.5-turbo": { input: 27, output: 108 },
  "deepseek-r1": { input: 99, output: 394 },
  "deepseek-chat": { input: 25, output: 50 },
  "claude-3.5-sonnet": { input: 540, output: 2700 },
  "gemini-2.0-flash": { input: 54, output: 450 },
} as const;

export type ModelName = keyof typeof MODEL_PRICING;
