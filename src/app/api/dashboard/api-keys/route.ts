import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { pool } from "@/lib/database";
import { authenticateRequest } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

export async function GET(request: NextRequest) {
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

    const userId = auth.userId;
    console.log("🔑 Getting API keys for user:", userId);

    const connection = await pool.getConnection();
    try {
      const [apiKeys] = await connection.execute(
        `
        SELECT 
          id,
          name,
          api_key,
          is_active,
          last_used_at,
          created_at,
          (SELECT COUNT(*) FROM usage_stats WHERE api_key_id = api_keys.id) as usage_count,
          (SELECT SUM(cost) FROM usage_stats WHERE api_key_id = api_keys.id) as total_cost
        FROM api_keys 
        WHERE user_id = ? AND is_active = TRUE
        ORDER BY created_at DESC
      `,
        [userId]
      );

      // Mask keys for security
      const maskedKeys = (apiKeys as any[]).map((key) => ({
        ...key,
        api_key:
          key.api_key.substring(0, 12) +
          "..." +
          key.api_key.substring(key.api_key.length - 4),
        total_cost: parseFloat(key.total_cost) || 0,
      }));

      console.log(`✅ Found ${(apiKeys as any[]).length} API keys`);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: maskedKeys,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error getting API keys:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}

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
    const { name } = body;
    const userId = auth.userId;

    console.log("🔑 Creating API key for user:", userId, "name:", name);

    const connection = await pool.getConnection();
    try {
      // Check key limit (maximum 5 per user)
      const [existingKeys] = await connection.execute(
        "SELECT COUNT(*) as count FROM api_keys WHERE user_id = ? AND is_active = TRUE",
        [userId]
      );

      if ((existingKeys as any[])[0].count >= 5) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Максимальное количество API ключей: 5",
          },
          { status: 400 }
        );
      }

      // Generate new key
      const apiKey = "sk-aigate-" + crypto.randomBytes(24).toString("hex");

      // Save to database
      const [result] = (await connection.execute(
        `
        INSERT INTO api_keys (user_id, name, api_key) 
        VALUES (?, ?, ?)
      `,
        [userId, name || "New API Key", apiKey]
      )) as any;

      console.log("✅ API key created with ID:", result.insertId);

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "API ключ создан успешно",
        data: {
          id: result.insertId,
          name: name || "New API Key",
          api_key: apiKey,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error creating API key:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
