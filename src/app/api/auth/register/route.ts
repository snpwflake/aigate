import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { hashPassword, generateToken } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || name.length < 2 || name.length > 50) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Имя должно быть от 2 до 50 символов",
        },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Введите корректный email",
        },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Пароль должен содержать минимум 6 символов",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const connection = await pool.getConnection();
    try {
      const [existingUsers] = await connection.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Пользователь с таким email уже существует",
          },
          { status: 400 }
        );
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const [result] = (await connection.execute(
        "INSERT INTO users (name, email, password, balance) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, 350]
      )) as any;

      const user = {
        id: result.insertId,
        name,
        email,
      };

      const token = generateToken(user);

      const response = NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "Регистрация прошла успешно",
          data: { token, user },
        },
        { status: 201 }
      );

      // Set cookie
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      console.log(`✅ Новый пользователь зарегистрирован: ${email}`);
      return response;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Ошибка регистрации:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
