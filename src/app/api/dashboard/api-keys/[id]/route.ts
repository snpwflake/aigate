import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { authenticateRequest } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, context: RouteParams) {
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

    const { id: keyId } = await context.params;
    const userId = auth.userId;

    console.log("🗑️ Deleting API key:", keyId, "for user:", userId);

    const connection = await pool.getConnection();
    try {
      // Check that the key belongs to the user
      const [existingKey] = await connection.execute(
        "SELECT id FROM api_keys WHERE id = ? AND user_id = ? AND is_active = TRUE",
        [keyId, userId]
      );

      if ((existingKey as Array<{ id: string }>).length === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "API ключ не найден",
          },
          { status: 404 }
        );
      }

      // Deactivate key (don't delete to preserve history)
      await connection.execute(
        "UPDATE api_keys SET is_active = FALSE WHERE id = ? AND user_id = ?",
        [keyId, userId]
      );

      console.log("✅ API key deactivated");

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "API ключ удален успешно",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error deleting API key:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteParams) {
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
    const { id: keyId } = await context.params;
    const userId = auth.userId;

    if (!name || name.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Название ключа обязательно",
        },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      // Check that the key belongs to the user
      const [existingKey] = await connection.execute(
        "SELECT id FROM api_keys WHERE id = ? AND user_id = ? AND is_active = TRUE",
        [keyId, userId]
      );

      if ((existingKey as Array<{ id: string }>).length === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "API ключ не найден",
          },
          { status: 404 }
        );
      }

      // Update key name
      await connection.execute(
        "UPDATE api_keys SET name = ? WHERE id = ? AND user_id = ?",
        [name.trim(), keyId, userId]
      );

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Название ключа обновлено успешно",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error updating API key:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
