"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const AdditionalServices = () => {
  const imageServices = SERVICES.filter((s) => s.name.includes("dall-e"));
  const ttsServices = SERVICES.filter((s) => s.name.includes("tts"));
  const speechServices = SERVICES.filter((s) => s.name.includes("whisper"));

  const ServiceTable = ({
    title,
    services,
  }: {
    title: string;
    services: typeof SERVICES;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">
                  Модель
                </th>
                {services.some((s) => s.quality) && (
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Сапа
                  </th>
                )}
                <th className="px-6 py-4 text-left font-semibold text-gray-900">
                  Баға
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <motion.tr
                  key={`${service.name}-${service.quality || index}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {service.name}
                      </span>
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded w-fit">
                        {service.provider}
                      </span>
                    </div>
                  </td>
                  {services.some((s) => s.quality) && (
                    <td className="px-6 py-4 text-gray-700">
                      {service.quality || service.unit}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(service.price)} /{" "}
                      {!service.quality ? service.unit : ""}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Қосымша қызметтер
          </h2>
        </motion.div>

        <ServiceTable
          title="Суреттер генерациясы және өңдеу"
          services={imageServices}
        />
        <ServiceTable
          title="Мәтіннен дауыс генерациясы"
          services={ttsServices}
        />
        <ServiceTable title="Дауысты тану" services={speechServices} />
      </div>
    </section>
  );
};

export default AdditionalServices;
