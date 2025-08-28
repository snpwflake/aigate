"use client";

import { motion } from "framer-motion";
import Counter from "@/components/common/Counter";
import { MAIN_STATS } from "@/lib/constants";

const Stats = () => {
  return (
    <section className="py-20 bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Біздің жетістіктер
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MAIN_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold mb-4">
                {stat.number.includes("+") || stat.number.includes("%") ? (
                  <>
                    <Counter
                      end={parseInt(stat.number.replace(/[^\d]/g, ""))}
                      className="text-4xl md:text-5xl font-bold"
                    />
                    {stat.number.replace(/[\d]/g, "")}
                  </>
                ) : (
                  stat.number
                )}
              </div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
