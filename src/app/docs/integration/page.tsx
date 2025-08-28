import Link from "next/link";
import CodeBlock from "@/components/docs/CodeBlock";

export default function IntegrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/docs/api"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← API құжаттамасына оралу
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Интеграция мысалдары
          </h1>

          <div className="space-y-12">
            {/* Next.js Integration */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Next.js интеграциясы
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    API Route
                  </h3>
                  <CodeBlock
                    language="javascript"
                    title="pages/api/chat.js"
                    code={`import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.AIGATE_API_KEY,
  basePath: 'https://api.aigate.kz/v1',
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, model = 'gpt-4o-mini' } = req.body;

    const completion = await openai.createChatCompletion({
      model,
      messages: [{ role: 'user', content: message }],
      max_tokens: 1000,
    });

    res.json({
      success: true,
      message: completion.data.choices[0].message.content,
      usage: completion.data.usage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'API Error'
    });
  }
}`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    React компонент
                  </h3>
                  <CodeBlock
                    language="jsx"
                    title="components/ChatWidget.jsx"
                    code={`import { useState } from 'react';

export default function ChatWidget() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          model: 'gpt-4o-mini'
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setResponse(data.message);
        setMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Сұрағыңызды жазыңыз..."
          className="w-full p-3 border border-gray-300 rounded"
          rows={3}
        />
      </div>
      
      <button
        onClick={sendMessage}
        disabled={loading || !message.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Жіберілуде...' : 'Жіберу'}
      </button>
      
      {response && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <strong>Жауап:</strong>
          <p className="mt-1">{response}</p>
        </div>
      )}
    </div>
  );
}`}
                  />
                </div>
              </div>
            </section>

            {/* Express.js Integration */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Express.js интеграциясы
              </h2>

              <CodeBlock
                language="javascript"
                title="server.js"
                code={`const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.AIGATE_API_KEY,
  basePath: 'https://api.aigate.kz/v1',
});

const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  try {
    const { message, model = 'gpt-4o-mini' } = req.body;

    const completion = await openai.createChatCompletion({
      model,
      messages: [{ role: 'user', content: message }],
      max_tokens: 1000,
    });

    res.json({
      success: true,
      message: completion.data.choices[0].message.content,
      usage: completion.data.usage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'API Error'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
              />
            </section>

            {/* Python Flask Integration */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Python Flask интеграциясы
              </h2>

              <CodeBlock
                language="python"
                title="app.py"
                code={`from flask import Flask, request, jsonify
import openai
import os

app = Flask(__name__)

# AIGATE конфигурациясы
openai.api_key = os.getenv('AIGATE_API_KEY')
openai.api_base = 'https://api.aigate.kz/v1'

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        model = data.get('model', 'gpt-4o-mini')
        
        response = openai.ChatCompletion.create(
            model=model,
            messages=[
                {'role': 'user', 'content': message}
            ],
            max_tokens=1000
        )
        
        return jsonify({
            'success': True,
            'message': response.choices[0].message.content,
            'usage': response.usage
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)`}
              />
            </section>

            {/* Environment Variables */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Қоршаған орта айнымалылары
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    .env файлы
                  </h3>
                  <CodeBlock
                    language="bash"
                    title=".env.local"
                    code={`# AIGATE API кілті
AIGATE_API_KEY=sk-aigate-your-api-key-here

# OpenAI үйлесімділік үшін
OPENAI_API_KEY=sk-aigate-your-api-key-here
OPENAI_BASE_URL=https://api.aigate.kz/v1

# Қауіпсіздік
JWT_SECRET=your-super-secret-jwt-key

# Дерекқор (қажет болса)
DATABASE_URL=mysql://user:password@localhost:3306/aigate`}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    ⚠️ Қауіпсіздік ескертуі
                  </h4>
                  <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
                    <li>API кілттерін ешқашан клиент кодында көрсетпеңіз</li>
                    <li>.env файлдарын git репозиторийге қоспаңыз</li>
                    <li>
                      Әр ортада (development, production) бөлек кілттер
                      пайдаланыңыз
                    </li>
                    <li>API кілттерін мерзімді түрде жаңартыңыз</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Testing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                🧪 Тестілеу
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Jest тесті
                  </h3>
                  <CodeBlock
                    language="javascript"
                    title="tests/api.test.js"
                    code={`const request = require('supertest');
const app = require('../server');

describe('AIGATE API Tests', () => {
  test('should get chat response', async () => {
    const response = await request(app)
      .post('/chat')
      .send({
        message: 'Тест хабары',
        model: 'gpt-4o-mini'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBeDefined();
    expect(response.body.usage).toBeDefined();
  });

  test('should handle invalid requests', async () => {
    const response = await request(app)
      .post('/chat')
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Postman коллекциясы
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 mb-3">
                      Postman арқылы API тестілеу үшін:
                    </p>
                    <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
                      <li>Жаңа коллекция жасаңыз</li>
                      <li>Authorization табында Bearer Token таңдаңыз</li>
                      <li>API кілтіңізді енгізіңіз</li>
                      <li>Base URL: https://api.aigate.kz/v1</li>
                      <li>Content-Type: application/json қойыңыз</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
