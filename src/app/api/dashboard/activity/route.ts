import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { authenticateRequest } from "@/lib/auth";
import { formatTimeAgo } from "@/lib/utils";
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
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = auth.userId;

    console.log("📈 Getting activity for user:", userId, "limit:", limit);

    const connection = await pool.getConnection();
    try {
      const [activities] = await connection.execute(
        `
        (
          SELECT 
            'api_usage' as type,
            CONCAT('API запрос - ', model_name) as title,
            CONCAT(FORMAT(cost, 4), ' ₸') as value,
            model_name as details,
            created_at
          FROM usage_stats 
          WHERE user_id = ?
        )
        UNION ALL
        (
          SELECT 
            CONCAT('balance_', transaction_type) as type,
            CASE 
              WHEN transaction_type = 'deposit' THEN 'Пополнение баланса'
              WHEN transaction_type = 'usage' THEN 'Использование API'
              WHEN transaction_type = 'refund' THEN 'Возврат средств'
              WHEN transaction_type = 'bonus' THEN 'Бонус'
              ELSE COALESCE(description, 'Транзакция')
            END as title,
            CASE 
              WHEN transaction_type IN ('deposit', 'refund', 'bonus') THEN CONCAT('+', FORMAT(amount, 2), ' ₸')
              ELSE CONCAT('-', FORMAT(amount, 2), ' ₸')
            END as value,
            description as details,
            created_at
          FROM balance_transactions 
          WHERE user_id = ?
        )
        ORDER BY created_at DESC
        LIMIT ?
      `,
        [userId, userId, limit]
      );

      // Format time
      const formattedActivities = (activities as any[]).map((activity) => ({
        ...activity,
        time: formatTimeAgo(new Date(activity.created_at)),
        created_at: activity.created_at,
      }));

      console.log(`✅ Found ${(activities as any[]).length} activities`);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: formattedActivities,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error getting activity:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
