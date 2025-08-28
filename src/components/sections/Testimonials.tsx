"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { TESTIMONIALS } from "@/lib/constants";

const Testimonials = () => {
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
            Клиенттер пікірлері
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card hover className="h-full">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 text-6xl text-primary-200 font-serif">
                    "
                  </div>
                  <p className="text-gray-600 italic mb-6 relative z-10 leading-relaxed">
                    {testimonial.content}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {testimonial.position}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
