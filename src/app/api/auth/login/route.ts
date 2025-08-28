import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { comparePassword, generateToken } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Email и пароль обязательны",
        },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        "SELECT id, name, email, password FROM users WHERE email = ?",
        [email]
      );

      if ((users as any[]).length === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Неверный email или пароль",
          },
          { status: 401 }
        );
      }

      const user = (users as any[])[0];
      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Неверный email или пароль",
          },
          { status: 401 }
        );
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = generateToken(userData);

      const response = NextResponse.json<ApiResponse>({
        success: true,
        message: "Авторизация прошла успешно",
        data: { token, user: userData },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log(`✅ Пользователь авторизовался: ${email}`);
      return response;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Ошибка авторизации:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
