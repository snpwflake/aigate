"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/ui/Card";

const GettingStarted = () => {
  const steps = [
    {
      number: "1",
      title: "API кілтін алу",
      description: "Біздің қызметке тіркеліп, API кілтін алыңыз",
    },
    {
      number: "2",
      title: "Баланс толтыру",
      description: "Қазақстандық карталармен ыңғайлы төлем жасаңыз",
    },
    {
      number: "3",
      title: "Интеграция",
      description: "Base URL-ді өзгертіп, API кілтін қосыңыз",
    },
  ];

  const useCases = [
    {
      title: "Өз бағдарламаңыз",
      description:
        "Қосымша жасаған кезде OpenAI кітапханаларын пайдаланыңыз: base_url-ді біздің API мекенжайына және панельден API кілтін ауыстыру жеткілікті. Үшінші тарап провайдерлерінің модельдері (Google Gemini, DeepSeek, Anthropic Claude, Meta Llama, Grok, Perplexity) бірыңғай схема бойынша жұмыс істейді!",
    },
    {
      title: "Үшінші тарап бағдарламасы",
      description:
        "OpenAI ChatGPT-мен үшінші тарап қосымшасын (мысалы, LangChain, Cline AI Assistant) пайдалану үшін API мекенжайын (Base URL) біздікіне ауыстырыңыз.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Қалай бастау керек?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            API кілтін алу үшін{" "}
            <Link
              href="mailto:contact@aigate.kz"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              contact@aigate.kz
            </Link>{" "}
            электрондық поштасына хат жазыңыз:
          </p>
        </motion.div>

        {/* Integration Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card hover className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-l-4 border-l-primary-500">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {useCase.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
