"use client";

import { motion } from "framer-motion";
import CodeBlock from "@/components/common/CodeBlock";
import { MODELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const ModelsAndPricing = () => {
  return (
    <section id="models" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Модельдер мен бағалар
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Бағалар 1 миллион токен үшін көрсетілген — бұл 15 қазақ кітабы
            сияқты. Тарифтер ай сайын қаралады — Қазақстандағы ең төмен бағаны
            кепілдейміз.
          </p>
        </motion.div>

        <CodeBlock />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Модель
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Кіріс
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Шығыс
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODELS.map((model, index) => (
                  <motion.tr
                    key={model.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {model.name}
                        </span>
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {model.provider}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(model.inputPrice)}
                        </span>
                        <span className="text-sm text-gray-500">1M токен</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(model.outputPrice)}
                        </span>
                        <span className="text-sm text-gray-500">1M токен</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModelsAndPricing;
