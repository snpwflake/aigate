import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { authenticateRequest } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

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
    const { amount, payment_method = "test" } = body;
    const userId = auth.userId;

    console.log("💰 Top up balance for user:", userId, "amount:", amount);

    if (!amount || amount <= 0 || amount > 50000) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Некорректная сумма (от 1 до 50000 ₸)",
        },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get current balance
      const [currentUser] = await connection.execute(
        "SELECT balance FROM users WHERE id = ? FOR UPDATE",
        [userId]
      );

      if ((currentUser as any[]).length === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Пользователь не найден",
          },
          { status: 404 }
        );
      }

      const currentBalance = parseFloat((currentUser as any[])[0].balance) || 0;
      const newBalance = currentBalance + parseFloat(amount);

      // Update user balance
      await connection.execute("UPDATE users SET balance = ? WHERE id = ?", [
        newBalance,
        userId,
      ]);

      // Record transaction
      const [transactionResult] = (await connection.execute(
        `
        INSERT INTO balance_transactions 
        (user_id, transaction_type, amount, balance_before, balance_after, description, reference_id) 
        VALUES (?, 'deposit', ?, ?, ?, ?, ?)
      `,
        [
          userId,
          amount,
          currentBalance,
          newBalance,
          payment_method === "test"
            ? "Тестовое пополнение баланса"
            : "Пополнение баланса",
          `topup_${Date.now()}_${userId}`,
        ]
      )) as any;

      await connection.commit();

      console.log("✅ Balance topped up successfully");

      return NextResponse.json<ApiResponse>({
        success: true,
        message: `Баланс пополнен на ${amount} ₸`,
        data: {
          transaction_id: transactionResult.insertId,
          old_balance: currentBalance,
          new_balance: newBalance,
          amount: parseFloat(amount),
        },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error topping up balance:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
