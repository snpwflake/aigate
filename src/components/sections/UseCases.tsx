"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { USE_CASES } from "@/lib/constants";

const UseCases = () => {
  return (
    <section id="use-cases" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Қолдану аясы
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {USE_CASES.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hover className="h-full border-l-4 border-l-primary-500">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {useCase.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {useCase.models.map((model) => (
                    <span
                      key={model}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
