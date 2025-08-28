import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  console.log("🚪 User logout request");

  const response = NextResponse.json<ApiResponse>({
    success: true,
    message: "Вы успешно вышли из системы",
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  return response;
}
