"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Key, Globe, AlertCircle } from "lucide-react";
import CodeBlock from "@/components/docs/CodeBlock";
import NavigationSidebar from "@/components/docs/NavigationSidebar";

const models = [
  {
    name: "gpt-4o-mini",
    description: "Жылдам және үнемді GPT-4 модель",
    context: "128K токен",
    features: "Көптеген тапсырмалар үшін оңтайлы",
    pricing: { input: 27, output: 108 },
  },
  {
    name: "gpt-4o",
    description: "Жетілдірілген GPT-4 модель",
    context: "128K токен",
    features: "Жоғары сапалы жауаптар",
    pricing: { input: 450, output: 1800 },
  },
  {
    name: "gpt-3.5-turbo",
    description: "gpt-4o-mini-ге бағытталған",
    context: "16K токен",
    features: "OpenAI үйлесімділігі",
    pricing: { input: 27, output: 108 },
  },
  {
    name: "deepseek-r1",
    description: "Жетілдірілген ойлау модель",
    context: "64K токен",
    features: "Логикалық тапсырмалар",
    pricing: { input: 99, output: 394 },
  },
  {
    name: "deepseek-chat",
    description: "Чат үшін үнемді модель",
    context: "32K токен",
    features: "Жалпы мақсаттағы чат",
    pricing: { input: 25, output: 50 },
  },
  {
    name: "claude-3.5-sonnet",
    description: "Anthropic Claude модель",
    context: "200K токен",
    features: "Ұзын контексттер",
    pricing: { input: 540, output: 2700 },
  },
  {
    name: "gemini-2.0-flash",
    description: "Google жылдам модель",
    context: "32K токен",
    features: "Мультимодальділік",
    pricing: { input: 54, output: 450 },
  },
];

const errorCodes = [
  {
    code: "400",
    type: "invalid_request_error",
    description: "Дұрыс емес сұрау параметрлері",
    solution: "Деректер форматын тексеріңіз",
  },
  {
    code: "401",
    type: "invalid_request_error",
    description: "API кілті жоқ",
    solution: "Authorization тақырыбын қосыңыз",
  },
  {
    code: "401",
    type: "invalid_request_error",
    description: "Дұрыс емес API кілті",
    solution: "Кілттің дұрыстығын тексеріңіз",
  },
  {
    code: "402",
    type: "insufficient_balance",
    description: "Қаражат жеткіліксіз",
    solution: "Балансты толтырыңыз",
  },
  {
    code: "408",
    type: "timeout_error",
    description: "Сұрау уақыты өтті",
    solution: "Сұрауды қайталаңыз",
  },
  {
    code: "429",
    type: "rate_limit_exceeded",
    description: "Сұраулар лимиті асты",
    solution: "Сұраулар жиілігін азайтыңыз",
  },
  {
    code: "502",
    type: "connection_error",
    description: "ЖИ-ға қосылу қатесі",
    solution: "Кейінірек көріңіз",
  },
  {
    code: "500",
    type: "server_error",
    description: "Сервердің ішкі қатесі",
    solution: "Қолдау қызметіне хабарласыңыз",
  },
];

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const initializeObserver = useCallback(() => {
    // Очищаем предыдущий observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sections = document.querySelectorAll(".endpoint-section");

    if (sections.length === 0) {
      console.log("No sections found, retrying in 100ms...");
      setTimeout(initializeObserver, 100);
      return;
    }

    console.log(`Initializing observer for ${sections.length} sections`);

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisible = { entry: null, ratio: 0 };

        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio > mostVisible.ratio
          ) {
            mostVisible = { entry, ratio: entry.intersectionRatio };
          }
        });

        if (mostVisible.entry) {
          const sectionId = mostVisible.entry.target.id;
          setActiveSection(sectionId);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7],
        rootMargin: "-80px 0px -50% 0px",
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    observerRef.current = observer;
  }, []);

  useEffect(() => {
    // Запускаем наблюдатель после рендеринга
    const timer = setTimeout(initializeObserver, 300);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [initializeObserver]);

  useEffect(() => {
    // Highlight.js initialization
    if (typeof window !== "undefined" && (window as any).hljs) {
      (window as any).hljs.highlightAll();
    }

    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes("#")) {
        e.preventDefault();
        const id = target.href.split("#")[1];
        console.log(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSection(id);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-6 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Басты бетке қайту
          </Link>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AIGATE API Құжаттамасы
            </h1>
            <p className="text-xl mb-4 opacity-90">
              Біздің жасанды интеллект қызметімен интеграциялау үшін API
              пайдалану жөніндегі толық нұсқаулық
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                OpenAI API үйлесімділігі
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                Көптеген модельдерді қолдау
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                Жылдам интеграция
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Navigation Sidebar */}
          <NavigationSidebar activeSection={activeSection} />

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Overview Section */}
            <section
              id="overview"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                📋 Шолу
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h4 className="font-semibold text-blue-900 mb-3">
                  Негізгі URL мекенжайлары
                </h4>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                    <strong className="text-gray-900">
                      OpenAI Compatible API:
                    </strong>
                    <code className="ml-2 text-blue-600">
                      https://api.aigate.kz/v1/
                    </code>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-500">
                    <strong className="text-gray-900">
                      Веб-интерфейс API:
                    </strong>
                    <code className="ml-2 text-green-600">
                      https://aigate.kz/api/
                    </code>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Қолдау көрсетілетін модельдер
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">
                        Модель
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">
                        Сипаттамасы
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">
                        Контекст
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">
                        Баға (₸/1M)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {models.map((model) => (
                      <tr key={model.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                            {model.name}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {model.description}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {model.context}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>Кіріс: {model.pricing.input} ₸</div>
                            <div>Шығыс: {model.pricing.output} ₸</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Authentication Section */}
            <section
              id="auth"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                🔐 Авторизация
              </h2>

              <p className="text-gray-700 mb-6">
                AIGATE екі түрлі авторизацияны қолдайды:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Key size={20} />
                    1. API кілттері (сыртқы қосымшалар үшін)
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <p className="mb-3">
                      <strong>Форматы:</strong> Authorization тақырыбындағы
                      Bearer токен
                    </p>
                    <div className="bg-green-100 border border-green-300 p-3 rounded font-mono text-sm text-green-800 mb-4">
                      Authorization: Bearer sk-aigate-your-api-key-here
                    </div>
                    <p className="text-gray-700 mb-4">
                      API кілттері жеке кабинетте жасалады және OpenAI үйлесімді
                      API-ға қол жеткізу үшін пайдаланылады.
                    </p>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Key size={18} />
                      API кілтін алу үшін Dashboard-қа өтіңіз
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe size={20} />
                    2. JWT токендер (веб-интерфейс үшін)
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <p className="mb-3">
                      <strong>Форматы:</strong> Bearer JWT токен
                    </p>
                    <div className="bg-blue-100 border border-blue-300 p-3 rounded font-mono text-sm text-blue-800 mb-4">
                      Authorization: Bearer
                      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    </div>
                    <p className="text-gray-700">
                      JWT токендер жүйеге кіру кезінде алынады және веб-API үшін
                      пайдаланылады.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-600 mt-0.5" size={20} />
                  <div>
                    <strong className="text-red-900">⚠️ Маңызды:</strong>
                    <p className="text-red-800 mt-1">
                      API кілттерін клиент кодында ешқашан бермеңіз. Оларды тек
                      серверде пайдаланыңыз.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  API кілтін алу
                </h3>
                <p className="text-gray-700 mb-3">API кілтін алу үшін:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-primary-600 hover:underline"
                    >
                      Dashboard бетіне
                    </Link>{" "}
                    өтіңіз
                  </li>
                  <li>Тіркеліңіз немесе жүйеге кіріңіз</li>
                  <li>{`"API кілттері" бөліміне өтіңіз`}</li>
                  <li>{`"Жаңа кілт жасау" батырмасын басыңыз`}</li>
                  <li>Кілтті қауіпсіз жерде сақтаңыз</li>
                </ol>
              </div>
            </section>

            {/* OpenAI Compatible API */}
            <section
              id="openai-api"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🤖 OpenAI Compatible API
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-green-900 mb-2">
                  Толық OpenAI үйлесімділігі
                </h4>
                <p className="text-green-800">
                  Біздің API OpenAI форматымен 100% үйлесімді. Қолданыстағы
                  OpenAI кодыңызды тек base_url өзгерту арқылы пайдалана аласыз.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Chat Completions
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      POST
                    </span>
                    <code className="bg-gray-100 px-3 py-2 rounded text-gray-800">
                      /v1/chat/completions
                    </code>
                  </div>

                  <CodeBlock
                    language="javascript"
                    title="OpenAI кітапханасымен"
                    code={`const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: 'sk-aigate-your-api-key',
    baseURL: 'https://api.aigate.kz/v1/',
});

const response = await client.chat.completions.create({
    messages: [
        { role: 'user', content: 'Қызықты факт айт' }
    ],
    model: 'gpt-4o-mini',
    max_tokens: 100,
    temperature: 0.7
});

console.log(response.choices[0].message.content);`}
                  />

                  <CodeBlock
                    language="python"
                    title="Python OpenAI кітапханасымен"
                    code={`from openai import OpenAI

client = OpenAI(
    api_key='sk-aigate-your-api-key',
    base_url='https://api.aigate.kz/v1/',
)

response = client.chat.completions.create(
    messages=[
        {'role': 'user', 'content': 'Қызықты факт айт'}
    ],
    model='gpt-4o-mini',
    max_tokens=100,
    temperature=0.7
)

print(response.choices[0].message.content)`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Параметрлер
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Параметр
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Түрі
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Міндетті
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Сипаттамасы
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3">
                            <code className="text-sm">messages</code>
                          </td>
                          <td className="px-4 py-3">array</td>
                          <td className="px-4 py-3 text-red-600 font-semibold">
                            Иә
                          </td>
                          <td className="px-4 py-3">
                            Хабарлар массиві (role, content)
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <code className="text-sm">model</code>
                          </td>
                          <td className="px-4 py-3">string</td>
                          <td className="px-4 py-3 text-gray-500">Жоқ</td>
                          <td className="px-4 py-3">
                            AI модель атауы (әдепкі: gpt-4o-mini)
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <code className="text-sm">max_tokens</code>
                          </td>
                          <td className="px-4 py-3">integer</td>
                          <td className="px-4 py-3 text-gray-500">Жоқ</td>
                          <td className="px-4 py-3">
                            Максималды токендер саны
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <code className="text-sm">temperature</code>
                          </td>
                          <td className="px-4 py-3">float</td>
                          <td className="px-4 py-3 text-gray-500">Жоқ</td>
                          <td className="px-4 py-3">
                            Креативтілік деңгейі (0.0-2.0)
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <code className="text-sm">stream</code>
                          </td>
                          <td className="px-4 py-3">boolean</td>
                          <td className="px-4 py-3 text-gray-500">Жоқ</td>
                          <td className="px-4 py-3">
                            Streaming режимі (әзірге қолдау көрсетілмейді)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Balance and Stats API */}
            <section
              id="balance-api"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                💰 Баланс және статистика API
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Баланс алу
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      GET
                    </span>
                    <code className="bg-gray-100 px-3 py-2 rounded text-gray-800">
                      /v1/aigate/balance
                    </code>
                  </div>

                  <CodeBlock
                    language="bash"
                    title="cURL мысалы"
                    code={`curl -X GET https://api.aigate.kz/v1/aigate/balance \\
  -H "Authorization: Bearer sk-aigate-your-api-key"`}
                  />

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Жауап мысалы:
                    </h4>
                    <CodeBlock
                      language="json"
                      code={`{
  "balance": 1250.75,
  "currency": "KZT",
  "last_updated": "2025-01-27T10:30:00Z"
}`}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Пайдалану статистикасы
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      GET
                    </span>
                    <code className="bg-gray-100 px-3 py-2 rounded text-gray-800">
                      /v1/aigate/stats
                    </code>
                  </div>

                  <CodeBlock
                    language="bash"
                    title="cURL мысалы"
                    code={`curl -X GET https://api.aigate.kz/v1/aigate/stats \\
  -H "Authorization: Bearer sk-aigate-your-api-key"`}
                  />

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Жауап мысалы:
                    </h4>
                    <CodeBlock
                      language="json"
                      code={`{
  "total_requests": 1234,
  "total_tokens": 567890,
  "total_cost": 234.56,
  "models_usage": {
    "gpt-4o-mini": {
      "requests": 800,
      "tokens": 400000,
      "cost": 150.30
    },
    "deepseek-chat": {
      "requests": 434,
      "tokens": 167890,
      "cost": 84.26
    }
  },
  "last_30_days": [
    {
      "date": "2025-01-27",
      "requests": 45,
      "tokens": 12000,
      "cost": 5.67
    }
  ]
}`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Web Chat API */}
            <section
              id="web-chat"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🌐 Веб-чат API
              </h2>

              <p className="text-gray-700 mb-6">
                Dashboard веб-интерфейсінде пайдалану үшін жеңілдетілген API.
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  POST
                </span>
                <code className="bg-gray-100 px-3 py-2 rounded text-gray-800">
                  /api/chat/web/chat
                </code>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <strong className="text-blue-900">🔑 Авторизация:</strong>
                <p className="text-blue-800 mt-1">
                  Authorization тақырыбындағы JWT токен: Bearer jwt-token
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Сұрау параметрлері
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Параметр
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Түрі
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Міндетті
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">
                            Сипаттамасы
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3">
                            <code className="text-sm">message</code>
                          </td>
                          <td className="px-4 py-3">string</td>
                          <td className="px-4 py-3 text-red-600 font-semibold">
                            Иә
                          </td>
                          <td className="px-4 py-3">
                            Пайдаланушы хабарының мәтіні
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <code className="text-sm">model</code>
                          </td>
                          <td className="px-4 py-3">string</td>
                          <td className="px-4 py-3 text-gray-500">Жоқ</td>
                          <td className="px-4 py-3">
                            ЖИ модель (әдепкі: gpt-4o-mini)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Сұрау мысалы
                  </h3>
                  <CodeBlock
                    language="javascript"
                    code={`fetch('/api/chat/web/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  credentials: 'include',
  body: JSON.stringify({
    message: "Сәлем! Қалайсыз?",
    model: "gpt-4o-mini"
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Сәтті жауап
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <CodeBlock
                      language="json"
                      code={`{
  "success": true,
  "data": {
    "message": "Сәлем! Менде бәрі жақсы, сұрағыңыз үшін рахмет! Сізде қалай жағдай?",
    "model": "gpt-4o-mini",
    "usage": {
      "prompt_tokens": 12,
      "completion_tokens": 25,
      "total_tokens": 37,
      "cost_kzt": 0.0032
    }
  }
}`}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
                <strong className="text-yellow-900">
                  💡 Веб-чаттың ерекшеліктері:
                </strong>
                <ul className="mt-3 space-y-1 text-yellow-800 ml-4 list-disc">
                  <li>
                    Пайдаланушының бірінші белсенді API кілтін автоматты түрде
                    пайдаланады
                  </li>
                  <li>Балансте қаражат болуын талап етеді</li>
                  <li>Сұрау мен жауаптың жеңілдетілген форматы</li>
                  <li>Ішкі Chat Completions API-ды шақырады</li>
                </ul>
              </div>
            </section>

            {/* Rate Limits */}
            <section
              id="rate-limits"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ⚡ Сұраулар лимиттері
              </h2>

              <p className="text-gray-700 mb-6">
                Сұраулар саны сіздің балансыңызға байланысты және 10 секундқа
                есептеледі:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">
                        Баланс
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">
                        Лимит (10 секундта)
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-900">
                        Сипаттамасы
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4">1000₸-ден төмен</td>
                      <td className="px-6 py-4 font-semibold">10 сұрау</td>
                      <td className="px-6 py-4">Бастапқы деңгей</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">1000-4999₸</td>
                      <td className="px-6 py-4 font-semibold">50 сұрау</td>
                      <td className="px-6 py-4">Орташа пайдаланушы</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">5000₸ және жоғары</td>
                      <td className="px-6 py-4 font-semibold">100 сұрау</td>
                      <td className="px-6 py-4">Жоғары көлем</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Лимит асқан жағдайда:
                </h4>
                <p className="text-blue-800">
                  429 қате кодымен жауап келеді. Retry-After заголовығында қанша
                  секундтан кейін қайталауға болатыны көрсетіледі.
                </p>
              </div>
            </section>

            {/* Error Codes */}
            <section
              id="errors"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ❌ Қате кодтары
              </h2>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Код
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Қате түрі
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Сипаттамасы
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Шешімі
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {errorCodes.map((error, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-red-600">
                          {error.code}
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-sm">{error.type}</code>
                        </td>
                        <td className="px-4 py-3">{error.description}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {error.solution}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Қате мысалдары
                </h3>

                <div>
                  <h4 className="font-semibold text-red-600 mb-3">
                    Дұрыс емес API кілті
                  </h4>
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <CodeBlock
                      language="json"
                      code={`{
  "error": {
    "message": "Invalid API key",
    "type": "invalid_request_error"
  }
}`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-red-600 mb-3">
                    Қаражат жеткіліксіз
                  </h4>
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <CodeBlock
                      language="json"
                      code={`{
  "error": {
    "message": "Insufficient balance. Please top up your account.",
    "type": "insufficient_balance",
    "required_balance": "0.0051",
    "current_balance": "0.00"
  }
}`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-red-600 mb-3">
                    Сыртқы API қатесі
                  </h4>
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <CodeBlock
                      language="json"
                      code={`{
  "error": {
    "message": "External API error",
    "type": "external_api_error",
    "details": {
      "error": {
        "message": "Model not found",
        "code": "model_not_found"
      }
    }
  }
}`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section
              id="examples"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                🔧 Жылдам мысалдар
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    cURL
                  </h3>
                  <CodeBlock
                    language="bash"
                    code={`curl -X POST https://api.aigate.kz/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-aigate-your-api-key" \\
  -d '{
    "messages": [
      {"role": "user", "content": "Сәлем!"}
    ],
    "model": "gpt-4o-mini",
    "max_tokens": 100
  }'`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Python (requests)
                  </h3>
                  <CodeBlock
                    language="python"
                    code={`import requests

response = requests.post(
    'https://api.aigate.kz/v1/chat/completions',
    headers={
        'Authorization': 'Bearer sk-aigate-your-api-key',
        'Content-Type': 'application/json'
    },
    json={
        'messages': [
            {'role': 'user', 'content': 'Сәлем!'}
        ],
        'model': 'gpt-4o-mini',
        'max_tokens': 100
    }
)

print(response.json())`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Node.js (axios)
                  </h3>
                  <CodeBlock
                    language="javascript"
                    code={`const axios = require('axios');

const response = await axios.post(
  'https://api.aigate.kz/v1/chat/completions',
  {
    messages: [
      { role: 'user', content: 'Сәлем!' }
    ],
    model: 'gpt-4o-mini',
    max_tokens: 100
  },
  {
    headers: {
      'Authorization': 'Bearer sk-aigate-your-api-key',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    PHP
                  </h3>
                  <CodeBlock
                    language="php"
                    code={`<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'https://api.aigate.kz/v1/chat/completions');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'messages' => [
        ['role' => 'user', 'content' => 'Сәлем!']
    ],
    'model' => 'gpt-4o-mini',
    'max_tokens' => 100
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer sk-aigate-your-api-key'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                <h4 className="font-semibold text-blue-900 mb-3">
                  🔗 Пайдалы сілтемелер:
                </h4>
                <ul className="space-y-2 text-blue-800">
                  <li>
                    <Link href="/dashboard" className="hover:underline">
                      Жеке кабинет (API кілттерін алу)
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/integration" className="hover:underline">
                      Интеграцияның толық мысалдары
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:underline">
                      Пайдаланушы келісімі
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:underline">
                      Құпиялылық саясаты
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="mailto:contact@aigate.kz"
                      className="hover:underline"
                    >
                      Техникалық қолдау: contact@aigate.kz
                    </Link>
                  </li>
                </ul>
              </div>
            </section>

            {/* SDK Examples */}
            <section
              id="sdk-examples"
              className="endpoint-section bg-white rounded-xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📦 SDK мысалдары
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    LangChain интеграциясы
                  </h3>
                  <CodeBlock
                    language="python"
                    code={`from langchain_openai import ChatOpenAI

# AIGATE арқылы LangChain пайдалану
llm = ChatOpenAI(
    model="gpt-4o-mini",
    openai_api_key="sk-aigate-your-api-key",
    openai_api_base="https://api.aigate.kz/v1",
    temperature=0.7
)

response = llm.invoke("Қазақстан туралы қызықты факт айт")
print(response.content)`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    React приложение
                  </h3>
                  <CodeBlock
                    language="javascript"
                    code={`import { useState } from 'react';

function ChatComponent() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat/web/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        },
        body: JSON.stringify({
          message,
          model: 'gpt-4o-mini'
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setResponse(data.data.message);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Сұрағыңызды енгізіңіз..."
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Жіберілуде...' : 'Жіберу'}
      </button>
      {response && <div>{response}</div>}
    </div>
  );
}`}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
