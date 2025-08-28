import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { authenticateRequest, hashPassword, comparePassword } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Текущий пароль и новый пароль обязательны",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Новый пароль должен содержать минимум 6 символов",
        },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        "SELECT password FROM users WHERE id = ?",
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

      const user = (users as any[])[0];
      const isValidPassword = await comparePassword(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Неверный текущий пароль",
          },
          { status: 400 }
        );
      }

      const hashedNewPassword = await hashPassword(newPassword);

      await connection.execute("UPDATE users SET password = ? WHERE id = ?", [
        hashedNewPassword,
        auth.userId,
      ]);

      console.log(`✅ Пользователь изменил пароль: ${auth.email}`);

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Пароль изменен успешно",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Ошибка изменения пароля:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
