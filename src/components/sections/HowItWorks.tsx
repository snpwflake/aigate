"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";

const HowItWorks = () => {
  const steps = [
    { title: "Сіздің қосымшаңыз", subtitle: "немесе үшінші тарап" },
    { title: "Http сұрау", subtitle: "OpenAI форматы" },
    { title: "Біздің API", subtitle: "api.aigate.kz/v1" },
    { title: "OpenAI", subtitle: "ChatGPT" },
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Қалай жұмысістейді?
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card hover className="text-center min-w-[200px]">
                  <h3 className="text-lg font-semibold text-primary-600 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.subtitle}</p>
                </Card>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="hidden lg:block mx-4"
                >
                  <ArrowRight className="text-primary-600" size={24} />
                </motion.div>
              )}

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="lg:hidden my-4 rotate-90"
                >
                  <ArrowRight className="text-primary-600" size={24} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
