import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { pool } from "./database";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthToken {
  userId: number;
  email: string;
}

export function generateToken(user: User): string {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch {
    return null;
  }
}

export function extractToken(request: NextRequest): string | null {
  // 1. Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // 2. Check cookies
  const token = request.cookies.get("token")?.value;
  if (token) {
    return token;
  }

  return null;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthToken | null> {
  const token = extractToken(request);
  if (!token) return null;

  return verifyToken(token);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface ApiKeyData {
  id: number;
  user_id: number;
  name: string;
  balance: string;
}

export async function authenticateApiKey(
  apiKey: string
): Promise<ApiKeyData | null> {
  const connection = await pool.getConnection();
  try {
    const [apiKeys] = (await connection.execute(
      `
      SELECT ak.id, ak.user_id, ak.name, u.balance 
      FROM api_keys ak 
      JOIN users u ON ak.user_id = u.id 
      WHERE ak.api_key = ? AND ak.is_active = TRUE
    `,
      [apiKey]
    )) as [ApiKeyData[], unknown];

    if (apiKeys.length === 0) {
      return null;
    }

    const apiKeyData = apiKeys[0];

    // Update last used timestamp
    await connection.execute(
      "UPDATE api_keys SET last_used_at = NOW() WHERE id = ?",
      [apiKeyData.id]
    );

    return apiKeyData;
  } finally {
    connection.release();
  }
}
