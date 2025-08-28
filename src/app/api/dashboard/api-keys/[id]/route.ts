import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { authenticateRequest } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const keyId = params.id;

    console.log("🗑️ Deleting API key:", keyId, "for user:", userId);

    const connection = await pool.getConnection();
    try {
      // Check that the key belongs to the user
      const [existingKey] = await connection.execute(
        "SELECT id FROM api_keys WHERE id = ? AND user_id = ? AND is_active = TRUE",
        [keyId, userId]
      );

      if ((existingKey as any[]).length === 0) {
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const keyId = params.id;

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

      if ((existingKey as any[]).length === 0) {
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
