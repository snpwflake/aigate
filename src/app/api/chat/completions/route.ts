import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { pool } from "@/lib/database";
import { authenticateApiKey } from "@/lib/auth";
import {
  validateChatRequest,
  calculateCost,
  estimateTokens,
  MIN_BALANCE,
} from "@/lib/utils";
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  OpenAIError,
  ModelName,
} from "@/types/api";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const authHeader = request.headers.get("authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (!apiKey) {
      return NextResponse.json<OpenAIError>(
        {
          error: {
            message: "API key required",
            type: "invalid_request_error",
          },
        },
        { status: 401 }
      );
    }

    const apiKeyData = await authenticateApiKey(apiKey);
    if (!apiKeyData) {
      return NextResponse.json<OpenAIError>(
        {
          error: {
            message: "Invalid API key",
            type: "invalid_request_error",
          },
        },
        { status: 401 }
      );
    }

    const body: ChatCompletionRequest = await request.json();
    const {
      messages,
      model = "gpt-3.5-turbo",
      max_tokens = 1000,
      temperature = 1,
      stream = false,
    } = body;

    console.log(
      `💬 Chat request from user ${apiKeyData.user_id}, model: ${model}`
    );

    // Validation
    const validationError = validateChatRequest(body);
    if (validationError) {
      return NextResponse.json<OpenAIError>(
        {
          error: {
            message: validationError,
            type: "invalid_request_error",
          },
        },
        { status: 400 }
      );
    }

    if (stream) {
      return NextResponse.json<OpenAIError>(
        {
          error: {
            message: "Streaming is not supported yet",
            type: "invalid_request_error",
          },
        },
        { status: 400 }
      );
    }

    const result = await processChatRequest(
      apiKeyData,
      messages,
      model as ModelName,
      max_tokens,
      temperature,
      request,
      startTime
    );

    return NextResponse.json<ChatCompletionResponse>(result);
  } catch (error: any) {
    console.error("❌ Chat completion error:", error);

    if (error.message?.startsWith("INSUFFICIENT_BALANCE:")) {
      const [, requiredBalance, currentBalance] = error.message.split(":");
      return NextResponse.json<OpenAIError>(
        {
          error: {
            message: "Insufficient balance. Please top up your account.",
            type: "insufficient_balance",
          },
        },
        { status: 402 }
      );
    }

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      return NextResponse.json<OpenAIError>(
        {
          error: {
            message: errorData.error?.message || "External API error",
            type: "external_api_error",
          },
        },
        { status }
      );
    }

    if (error.code === "ECONNABORTED") {
      return NextResponse.json<OpenAIError>(
        {
          error: {
            message: "Request timeout. Please try again.",
            type: "timeout_error",
          },
        },
        { status: 408 }
      );
    }

    return NextResponse.json<OpenAIError>(
      {
        error: {
          message: "Internal server error",
          type: "server_error",
        },
      },
      { status: 500 }
    );
  }
}

async function processChatRequest(
  apiKeyData: any,
  messages: any[],
  model: ModelName,
  maxTokens: number,
  temperature: number,
  request: NextRequest,
  startTime: number
): Promise<ChatCompletionResponse> {
  const userId = apiKeyData.user_id;
  const apiKeyId = apiKeyData.id;
  const userBalance = parseFloat(apiKeyData.balance);

  // Calculate input tokens
  const inputText = messages.map((m) => m.content).join(" ");
  const inputTokens = estimateTokens(inputText);

  // Estimate maximum cost
  const estimatedCost = calculateCost(model, inputTokens, maxTokens);

  // Check balance
  if (userBalance < estimatedCost || userBalance < MIN_BALANCE) {
    throw new Error(
      `INSUFFICIENT_BALANCE:${estimatedCost.toFixed(4)}:${userBalance.toFixed(
        2
      )}`
    );
  }

  // Make request to BotHub API
  const bothubResponse = await axios.post(
    "https://bothub.chat/api/v2/openai/v1/chat/completions",
    {
      messages,
      model,
      max_tokens: maxTokens,
      temperature,
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.BOTHUB_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 45000,
    }
  );

  const response = bothubResponse.data;
  const outputText = response.choices?.[0]?.message?.content || "";
  const outputTokens = estimateTokens(outputText);

  // Calculate actual cost
  const actualCost = calculateCost(model, inputTokens, outputTokens);
  const totalTokens = inputTokens + outputTokens;

  console.log(
    `💰 Cost calculation for user ${userId}: ${inputTokens} + ${outputTokens} = ${totalTokens} tokens, cost: ${actualCost.toFixed(
      4
    )} ₸`
  );

  // Begin transaction to deduct funds
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Get current balance
    const [currentUser] = await connection.execute(
      "SELECT balance FROM users WHERE id = ? FOR UPDATE",
      [userId]
    );

    if ((currentUser as any[]).length === 0) {
      throw new Error("User not found");
    }

    const currentBalance = parseFloat((currentUser as any[])[0].balance);
    const newBalance = currentBalance - actualCost;

    if (newBalance < 0) {
      throw new Error("Insufficient balance after calculation");
    }

    // Update user balance
    await connection.execute(
      "UPDATE users SET balance = ?, total_requests = total_requests + 1, total_tokens = total_tokens + ?, total_cost = total_cost + ? WHERE id = ?",
      [newBalance, totalTokens, actualCost, userId]
    );

    // Record usage stats
    await connection.execute(
      `
      INSERT INTO usage_stats 
      (user_id, api_key_id, model_name, endpoint, input_tokens, output_tokens, total_tokens, cost, request_duration_ms, ip_address) 
      VALUES (?, ?, ?, 'chat', ?, ?, ?, ?, ?, ?)
    `,
      [
        userId,
        apiKeyId,
        model,
        inputTokens,
        outputTokens,
        totalTokens,
        actualCost,
        Date.now() - startTime,
        request.ip || "unknown",
      ]
    );

    // Record balance transaction
    await connection.execute(
      `
      INSERT INTO balance_transactions 
      (user_id, transaction_type, amount, balance_before, balance_after, description) 
      VALUES (?, 'usage', ?, ?, ?, ?)
    `,
      [
        userId,
        actualCost,
        currentBalance,
        newBalance,
        `API запрос - ${model} (${totalTokens} токенов)`,
      ]
    );

    await connection.commit();

    console.log(
      `✅ Transaction completed for user ${userId}. New balance: ${newBalance.toFixed(
        2
      )} ₸`
    );

    return {
      id: response.id || `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: response.choices || [
        {
          index: 0,
          message: {
            role: "assistant",
            content: outputText,
          },
          finish_reason: response.choices?.[0]?.finish_reason || "stop",
        },
      ],
      usage: {
        prompt_tokens: inputTokens,
        completion_tokens: outputTokens,
        total_tokens: totalTokens,
        cost_kzt: parseFloat(actualCost.toFixed(4)),
      },
    };
  } catch (dbError) {
    await connection.rollback();
    throw dbError;
  } finally {
    connection.release();
  }
}
