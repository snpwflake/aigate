"use client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price} ₸`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("kk-KZ").format(num);
}

import { ChatCompletionRequest, MODEL_PRICING, ModelName } from "@/types/api";

export const MAX_MESSAGE_LENGTH = 100000;
export const MAX_TOKENS = 8000;
export const MIN_BALANCE = 0.01;

export function calculateCost(
  model: ModelName,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING["gpt-3.5-turbo"];
  const inputCost = (inputTokens / 1000000) * pricing.input;
  const outputCost = (outputTokens / 1000000) * pricing.output;
  return inputCost + outputCost;
}

export function estimateTokens(text: string): number {
  if (!text || typeof text !== "string") return 0;

  if (text.length > MAX_MESSAGE_LENGTH) {
    throw new Error(
      `Text too large. Maximum ${MAX_MESSAGE_LENGTH} characters allowed`
    );
  }

  return Math.ceil(text.length / 3);
}

export function validateChatRequest(
  body: ChatCompletionRequest
): string | null {
  const { messages, model, max_tokens, temperature } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return "Messages array is required and must not be empty";
  }

  if (messages.length > 50) {
    return "Too many messages. Maximum 50 messages allowed";
  }

  for (const message of messages) {
    if (!message.role || !message.content) {
      return "Each message must have 'role' and 'content' fields";
    }

    if (!["user", "assistant", "system"].includes(message.role)) {
      return "Message role must be 'user', 'assistant', or 'system'";
    }

    if (typeof message.content !== "string") {
      return "Message content must be a string";
    }

    if (message.content.length > MAX_MESSAGE_LENGTH) {
      return `Message content too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed`;
    }
  }

  if (model && !MODEL_PRICING[model as ModelName]) {
    return `Unsupported model: ${model}. Supported models: ${Object.keys(
      MODEL_PRICING
    ).join(", ")}`;
  }

  if (max_tokens && (max_tokens < 1 || max_tokens > MAX_TOKENS)) {
    return `max_tokens must be between 1 and ${MAX_TOKENS}`;
  }

  if (temperature !== undefined && (temperature < 0 || temperature > 2)) {
    return "temperature must be between 0 and 2";
  }

  return null;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} секунд назад`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} минут${minutes === 1 ? "у" : ""} назад`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} час${hours === 1 ? "" : hours < 5 ? "а" : "ов"} назад`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"} назад`;
  }
}
