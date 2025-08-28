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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type"); // filter by transaction type
    const offset = (page - 1) * limit;
    const userId = auth.userId;

    console.log("💳 Getting transactions for user:", userId, "page:", page);

    const connection = await pool.getConnection();
    try {
      let whereClause = "WHERE user_id = ?";
      const queryParams: any[] = [userId];

      if (type && ["deposit", "usage", "refund", "bonus"].includes(type)) {
        whereClause += " AND transaction_type = ?";
        queryParams.push(type);
      }

      const [transactions] = await connection.execute(
        `
        SELECT 
          id,
          transaction_type,
          amount,
          balance_before,
          balance_after,
          description,
          reference_id,
          created_at
        FROM balance_transactions 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
        [...queryParams, limit, offset]
      );

      // Get total count
      const [totalCount] = await connection.execute(
        `SELECT COUNT(*) as count FROM balance_transactions ${whereClause}`,
        queryParams
      );

      // Get summary statistics
      const [summary] = await connection.execute(
        `
        SELECT 
          transaction_type,
          COUNT(*) as count,
          SUM(amount) as total_amount
        FROM balance_transactions 
        WHERE user_id = ?
        GROUP BY transaction_type
      `,
        [userId]
      );

      console.log(`✅ Found ${(transactions as any[]).length} transactions`);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          transactions,
          summary,
          pagination: {
            page,
            limit,
            total: (totalCount as any[])[0].count,
            pages: Math.ceil((totalCount as any[])[0].count / limit),
          },
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error getting transactions:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
