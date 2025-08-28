"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary-500 to-accent-500 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Жасанды интеллектті бүгін-ақ пайдаланып көріңіз
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            API кілтін алып, бірнеше минутта жұмысты бастаңыз
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            <Link href="/login">Кілтті алу</Link>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary-600"
          >
            <Link href="mailto:contact@aigate.kz">Сұрақ қою</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
