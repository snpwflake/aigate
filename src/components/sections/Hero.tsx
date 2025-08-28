"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { HERO_STATS } from "@/lib/constants";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-secondary-500 to-accent-500 text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            OpenAI API, DeepSeek API ең төмен бағамен Қазақстанда VPN-сіз
            қолжетімділік⚡
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Жасанды интеллект модельдеріне қолжетімділік алыңыз. Теңгемен төлем
            жасаңыз.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button size="lg">
            <Link href="/login">Кілтті алу</Link>
          </Button>
          <Button variant="secondary" size="lg">
            <Link href="#models">Модельдерді көру</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
