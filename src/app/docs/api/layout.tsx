import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Құжаттамасы - AIGATE",
  description:
    "AIGATE API пайдалану жөніндегі толық құжаттама. OpenAI үйлесімді API, көптеген AI модельдер, жылдам интеграция.",
  keywords:
    "API, документация, OpenAI, ChatGPT, AI, Kazakhstan, integration, docs",
  openGraph: {
    title: "AIGATE API Құжаттамасы",
    description: "Толық API құжаттамасы және интеграция мысалдары",
    type: "website",
  },
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
