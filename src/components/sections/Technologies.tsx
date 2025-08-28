"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { TECHNOLOGIES } from "@/lib/constants";

const Technologies = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Қолдау көрсетілетін технологиялар
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {TECHNOLOGIES.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hover className="text-center p-4 h-full">
                <div className="text-3xl mb-3">{tech.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  {tech.name}
                </h4>
                <p className="text-xs text-gray-600">{tech.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
