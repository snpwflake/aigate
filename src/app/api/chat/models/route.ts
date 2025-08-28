import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/auth";
import { MODEL_PRICING } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (!apiKey) {
      return NextResponse.json(
        {
          error: {
            message: "API key required",
            type: "invalid_request_error",
          },
        },
        { status: 401 }
      );
    }

    const apiKeyData = await authenticateApiKey(apiKey);
    if (!apiKeyData) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid API key",
            type: "invalid_request_error",
          },
        },
        { status: 401 }
      );
    }

    const models = Object.keys(MODEL_PRICING).map((model) => ({
      id: model,
      object: "model",
      created: Math.floor(Date.now() / 1000),
      owned_by: "bothub",
      pricing: MODEL_PRICING[model as keyof typeof MODEL_PRICING],
    }));

    return NextResponse.json({
      object: "list",
      data: models,
    });
  } catch (error) {
    console.error("❌ Models error:", error);
    return NextResponse.json(
      {
        error: {
          message: "Internal server error",
          type: "server_error",
        },
      },
      { status: 500 }
    );
  }
}
