"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CodeExample {
  lang: string;
  label: string;
  code: string;
}

const codeExamples: CodeExample[] = [
  {
    lang: "javascript",
    label: "JavaScript",
    code: `const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: 'sk-aigate-xxx', // Біздің сервистен кілт
    baseURL: 'https://api.aigate.kz/v1/',
});

const chatResult = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Қызықты факт айт' }],
    model: 'deepseek-r1',
    max_tokens: 50000,
});
console.log(chatResult.choices[0]?.message);`,
  },
  {
    lang: "python",
    label: "Python",
    code: `from openai import OpenAI

client = OpenAI(
    api_key='sk-aigate-xxx',  # Біздің сервістен кілт
    base_url='https://api.aigate.kz/v1/',
)

chat_result = client.chat.completions.create(
    messages=[{"role": "user", "content": "Қызықты факт айт"}],
    model="deepseek-r1",
    max_tokens=50000,
)
print(chat_result.choices[0].message)`,
  },
  {
    lang: "curl",
    label: "Curl",
    code: `curl -X POST https://api.aigate.kz/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-aigate-xxx" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [{"role": "user", "content": "Қызықты факт айт"}],
    "max_tokens": 50000
  }'`,
  },
];

const CodeBlock = () => {
  const [activeTab, setActiveTab] = useState("javascript");

  return (
    <div className="mb-12">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {codeExamples.map((example) => (
          <button
            key={example.lang}
            onClick={() => setActiveTab(example.lang)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === example.lang
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {example.label}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto"
      >
        <pre className="text-sm">
          <code>{codeExamples.find((ex) => ex.lang === activeTab)?.code}</code>
        </pre>
      </motion.div>
    </div>
  );
};

export default CodeBlock;
