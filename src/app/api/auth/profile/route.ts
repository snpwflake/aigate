import { NextRequest, NextResponse } from "next/server";
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

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        "SELECT id, name, email, balance, created_at FROM users WHERE id = ?",
        [auth.userId]
      );

      if ((users as any[]).length === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Пользователь не найден",
          },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        data: { user: (users as any[])[0] },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Ошибка получения профиля:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    if (name && (name.length < 2 || name.length > 50)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Имя должно быть от 2 до 50 символов",
        },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.execute("UPDATE users SET name = ? WHERE id = ?", [
        name,
        auth.userId,
      ]);

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Профиль обновлен успешно",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Ошибка обновления профиля:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
