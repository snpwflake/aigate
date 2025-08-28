import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/common/NotificationProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "AIGATE ⚡ OpenAI ChatGPT API, Gemini, DeepSeek API, Claude қолжетімділігі Қазақстанда VPN-сіз. Теңгемен төлем.",
  description:
    "OpenAI API, DeepSeek API ең төмен бағамен Қазақстанда VPN-сіз қолжетімділік",
  keywords:
    "OpenAI, ChatGPT, API, DeepSeek, Claude, Gemini, Kazakhstan, AI, VPN-free",
  authors: [{ name: "AIGATE" }],
  robots: "index, follow",
  openGraph: {
    title: "AIGATE - AI API қызметтері Қазақстанда",
    description:
      "OpenAI API, DeepSeek API ең төмен бағамен Қазақстанда VPN-сіз қолжетімділік",
    type: "website",
    locale: "kk_KZ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk" className="scroll-smooth">
      <body className={inter.className}>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
