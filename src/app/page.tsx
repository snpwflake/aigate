import Hero from "@/components/sections/Hero";
import Advantages from "@/components/sections/Advantages";
import HowItWorks from "@/components/sections/HowItWorks";
import UseCases from "@/components/sections/UseCases";
import GettingStarted from "@/components/sections/GettingStarted";
import Technologies from "@/components/sections/Technologies";
import ModelsAndPricing from "@/components/sections/ModelsAndPricing";
import AdditionalServices from "@/components/sections/AdditionalServices";
import Testimonials from "@/components/sections/Testimonials";
import Stats from "@/components/sections/Stats";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Advantages />
      <HowItWorks />
      <UseCases />
      <GettingStarted />
      <Technologies />
      <ModelsAndPricing />
      <AdditionalServices />
      {/* <Testimonials /> */}
      {/* <Stats /> */}
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
