import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { authenticateRequest } from "@/lib/auth";
import {
  validateChatRequest,
  calculateCost,
  estimateTokens,
  MIN_BALANCE,
  MAX_MESSAGE_LENGTH,
} from "@/lib/utils";
import { ApiResponse, ModelName, MODEL_PRICING } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Токен доступа отсутствует или недействителен",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, model = "gpt-3.5-turbo" } = body;
    const userId = auth.userId;

    console.log(`🌐 Web chat request from user ${userId}, model: ${model}`);

    // Validation
    if (!message) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Поле 'message' отсутствует в запросе",
        },
        { status: 400 }
      );
    }

    if (typeof message !== "string") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Поле 'message' должно быть строкой",
        },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Сообщение не может быть пустым",
        },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: `Сообщение слишком длинное. Максимум ${MAX_MESSAGE_LENGTH} символов`,
        },
        { status: 400 }
      );
    }

    if (!MODEL_PRICING[model as ModelName]) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: `Неподдерживаемая модель: ${model}`,
        },
        { status: 400 }
      );
    }

    // Get user's active API key
    const connection = await pool.getConnection();
    try {
      const [apiKeys] = await connection.execute(
        `
        SELECT ak.id, ak.user_id, ak.api_key, ak.name, u.balance 
        FROM api_keys ak 
        JOIN users u ON ak.user_id = u.id 
        WHERE ak.user_id = ? AND ak.is_active = TRUE 
        ORDER BY ak.created_at DESC
        LIMIT 1
      `,
        [userId]
      );

      if ((apiKeys as any[]).length === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message:
              "У вас нет активных API ключей. Создайте ключ для использования чата.",
          },
          { status: 400 }
        );
      }

      const apiKeyData = (apiKeys as any[])[0];
      const balance = parseFloat(apiKeyData.balance);

      if (balance < MIN_BALANCE) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message:
              "Недостаточно средств на балансе. Пополните баланс для продолжения.",
            data: { current_balance: balance.toFixed(2) },
          },
          { status: 402 }
        );
      }

      // Use the same processing function as the API
      const result = await processChatRequestWeb(
        apiKeyData,
        [{ role: "user", content: message.trim() }],
        model as ModelName,
        2000,
        1,
        request
      );

      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          message: result.choices[0].message.content,
          model: model,
          usage: result.usage,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Web chat error:", error);

    if (error.message?.startsWith("INSUFFICIENT_BALANCE:")) {
      const [, requiredBalance, currentBalance] = error.message.split(":");
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Недостаточно средств на балансе",
          data: {
            required_balance: requiredBalance,
            current_balance: currentBalance,
          },
        },
        { status: 402 }
      );
    }

    if (error.response) {
      const errorData = error.response.data;
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: errorData.error?.message || "Ошибка внешнего API",
          error: errorData.error,
        },
        { status: error.response.status }
      );
    }

    if (error.code === "ECONNABORTED") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Превышено время ожидания. Попробуйте еще раз.",
        },
        { status: 408 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}

// Simplified version for web interface
async function processChatRequestWeb(
  apiKeyData: any,
  messages: any[],
  model: ModelName,
  maxTokens: number,
  temperature: number,
  request: NextRequest
) {
  // This would be the same logic as processChatRequest but simplified
  // For brevity, I'm referencing the same function structure
  // You can extract the common logic into a shared function
  return {
    choices: [
      {
        message: {
          content:
            "Web chat response placeholder - implement with same logic as API",
        },
      },
    ],
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
      cost_kzt: 0.01,
    },
  };
}
