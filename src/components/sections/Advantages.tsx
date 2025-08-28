"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { ADVANTAGES } from "@/lib/constants";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Advantages = () => {
  const ref = useScrollAnimation();

  return (
    <section id="advantages" className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Неліктен AIGATE таңдау керек?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVANTAGES.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hover className="text-center h-full">
                <div className="text-5xl mb-4">{advantage.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
