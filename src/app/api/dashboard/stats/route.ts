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

    const userId = auth.userId;
    console.log("📊 Getting stats for user:", userId);

    const connection = await pool.getConnection();
    try {
      // Get main user statistics
      const [userStats] = await connection.execute(
        `
        SELECT 
          balance,
          total_requests,
          total_tokens,
          total_cost,
          (SELECT COUNT(*) FROM api_keys WHERE user_id = ? AND is_active = TRUE) as api_keys_count
        FROM users 
        WHERE id = ?
      `,
        [userId, userId]
      );

      if ((userStats as any[]).length === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Пользователь не найден",
          },
          { status: 404 }
        );
      }

      // Get statistics for the last 30 days
      const [monthlyStats] = await connection.execute(
        `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as requests,
          SUM(total_tokens) as tokens,
          SUM(cost) as cost
        FROM usage_stats 
        WHERE user_id = ? 
          AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,
        [userId]
      );

      // Get statistics by models
      const [modelStats] = await connection.execute(
        `
        SELECT 
          model_name,
          COUNT(*) as requests,
          SUM(total_tokens) as tokens,
          SUM(cost) as cost
        FROM usage_stats 
        WHERE user_id = ? 
          AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY model_name
        ORDER BY cost DESC
        LIMIT 10
      `,
        [userId]
      );

      // Get hourly stats for today
      const [hourlyStats] = await connection.execute(
        `
        SELECT 
          HOUR(created_at) as hour,
          COUNT(*) as requests,
          SUM(total_tokens) as tokens,
          SUM(cost) as cost
        FROM usage_stats 
        WHERE user_id = ? 
          AND DATE(created_at) = CURDATE()
        GROUP BY HOUR(created_at)
        ORDER BY hour
      `,
        [userId]
      );

      console.log("✅ Stats loaded successfully");

      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          overview: {
            balance: parseFloat((userStats as any[])[0].balance) || 0,
            total_requests: (userStats as any[])[0].total_requests || 0,
            total_tokens: (userStats as any[])[0].total_tokens || 0,
            total_cost: parseFloat((userStats as any[])[0].total_cost) || 0,
            api_keys_count: (userStats as any[])[0].api_keys_count || 0,
          },
          dailyStats: monthlyStats,
          modelStats: modelStats,
          hourlyStats: hourlyStats,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error getting dashboard stats:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
