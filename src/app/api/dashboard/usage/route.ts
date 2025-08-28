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
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const model = searchParams.get("model");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    const userId = auth.userId;

    console.log("📊 Getting usage stats for user:", userId);

    const connection = await pool.getConnection();
    try {
      let whereClause = "WHERE user_id = ?";
      const queryParams: any[] = [userId];

      if (model) {
        whereClause += " AND model_name = ?";
        queryParams.push(model);
      }

      if (dateFrom) {
        whereClause += " AND created_at >= ?";
        queryParams.push(dateFrom);
      }

      if (dateTo) {
        whereClause += " AND created_at <= ?";
        queryParams.push(dateTo);
      }

      const [stats] = await connection.execute(
        `
        SELECT 
          id,
          model_name,
          endpoint,
          input_tokens,
          output_tokens,
          total_tokens,
          cost,
          request_duration_ms,
          ip_address,
          created_at
        FROM usage_stats 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `,
        [...queryParams, limit, offset]
      );

      const [totalCount] = await connection.execute(
        `SELECT COUNT(*) as count FROM usage_stats ${whereClause}`,
        queryParams
      );

      // Get aggregated statistics
      const [aggregated] = await connection.execute(
        `
        SELECT 
          COUNT(*) as total_requests,
          SUM(total_tokens) as total_tokens,
          SUM(cost) as total_cost,
          AVG(request_duration_ms) as avg_duration,
          MIN(created_at) as first_request,
          MAX(created_at) as last_request
        FROM usage_stats 
        ${whereClause}
      `,
        queryParams
      );

      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          usage: stats,
          aggregated: (aggregated as any[])[0],
          pagination: {
            limit,
            offset,
            total: (totalCount as any[])[0].count,
          },
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ Usage stats error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
