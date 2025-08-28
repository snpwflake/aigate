"use client";

import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";
import { ChatMessage } from "@/types/dashboard";
import { useNotification } from "@/hooks/useNotification";

interface ChatProps {
  onDataUpdate: () => void;
}

const models = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "deepseek-r1", label: "DeepSeek R1" },
  { value: "deepseek-chat", label: "DeepSeek Chat" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
];

export default function Chat({ onDataUpdate }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showNotification } = useNotification();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/web/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: input.trim(),
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.data.message,
          timestamp: new Date().toISOString(),
          meta: {
            model: data.data.model,
            usage: data.data.usage,
          },
        };

        setMessages((prev) => [...prev, assistantMessage]);
        onDataUpdate(); // Обновляем статистику
      } else {
        throw new Error(data.message || "Ошибка API");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      showNotification(error.message || "Ошибка отправки сообщения", "error");

      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `Ошибка: ${error.message || "Не удалось получить ответ"}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    showNotification("Чат очищен", "info");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessageContent = (content: string) => {
    return content
      .replace(/\n/g, "<br>")
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'
      )
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-3 rounded mt-2 overflow-x-auto"><code>$1</code></pre>'
      );
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">
        AI Чат
      </h2>

      <div className="h-[500px] md:h-[600px] flex flex-col border border-gray-200 rounded-xl overflow-hidden">
        {/* Header - адаптивный */}
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Модель:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-2 md:px-3 py-1 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {models.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3 py-1 text-xs md:text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Очистить чат</span>
            <span className="sm:hidden">Очистить</span>
          </button>
        </div>

        {/* Messages - адаптивные отступы */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 md:py-20 text-gray-500">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">👋</div>
              <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">
                Добро пожаловать в AI чат!
              </h3>
              <p className="text-sm">Выберите модель и начните общение.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 md:gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] ${
                    message.role === "user" ? "order-2" : ""
                  }`}
                >
                  <div
                    className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary-600 to-purple-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div
                      className="text-sm md:text-base"
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(message.content),
                      }}
                    />
                  </div>

                  {message.meta && (
                    <div className="text-xs text-gray-500 mt-1 px-1">
                      <span className="hidden md:inline">
                        {message.meta.model} • {message.meta.usage.total_tokens}{" "}
                        токенов • {message.meta.usage.cost_kzt} ₸
                      </span>
                      <span className="md:hidden">
                        {message.meta.usage.cost_kzt} ₸
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm ${
                    message.role === "user" ? "order-1" : ""
                  } ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary-600 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {message.role === "user" ? "👤" : "🤖"}
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2 md:gap-3 justify-start">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs md:text-sm">
                🤖
              </div>
              <div className="bg-white border border-gray-200 px-3 md:px-4 py-2 md:py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input - адаптивный */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 px-3 md:px-6 py-3 md:py-4 border-t border-gray-200"
        >
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите ваше сообщение..."
              rows={1}
              className="flex-1 resize-none px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            <span className="hidden md:inline">
              Нажмите Enter для отправки, Shift+Enter для новой строки
            </span>
            <span className="md:hidden">
              Enter - отправить, Shift+Enter - новая строка
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
