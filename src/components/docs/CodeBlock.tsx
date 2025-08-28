"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";

interface HighlightCodeBlockProps {
  language: string;
  code: string;
  title?: string;
}

export default function CodeBlock({
  language,
  code,
  title,
}: HighlightCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        // Динамически импортируем highlight.js
        const hljs = (await import("highlight.js")).default;

        // Импортируем CSS стили
        // @ts-ignore
        await import("highlight.js/styles/github-dark.css");

        // Регистрируем языки
        const registerLanguage = async (lang: string) => {
          try {
            const langModule = await import(
              `highlight.js/lib/languages/${lang}`
            );
            hljs.registerLanguage(lang, langModule.default);
          } catch (error) {}
        };

        // Регистрируем нужные языки
        await Promise.all([
          registerLanguage("javascript"),
          registerLanguage("python"),
          registerLanguage("bash"),
          registerLanguage("json"),
          registerLanguage("php"),
          registerLanguage("typescript"),
        ]);

        // Подсвечиваем код в элементе
        if (codeRef.current) {
          hljs.highlightElement(codeRef.current);
        }
      } catch (error) {
        console.error("Highlight.js error:", error);
      }
    };

    highlightCode();
  }, [language, code]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg my-4">
      {title && (
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
          <span className="text-gray-300 text-sm font-medium">{title}</span>
          <span className="text-gray-500 text-xs uppercase font-medium">
            {language}
          </span>
        </div>
      )}

      <div className="relative">
        <button
          onClick={copyToClipboard}
          className={`absolute top-3 right-3 p-2 rounded-md transition-all duration-200 z-10 ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          title={copied ? "Көшірілді!" : "Көшіру"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>

        <pre className="p-4 pr-16 overflow-x-auto">
          <code
            ref={codeRef}
            className={`language-${language} text-sm leading-6`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
