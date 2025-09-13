import Header from "@/components/layout/header";
import HeroSection from "@/components/sections/hero";
import FixedRateSection from "@/components/sections/fixed-rate";
import LoanInterface from "@/components/business/loan/loan-interface";
import FeaturesSection from "@/components/sections/features";
import FAQSection from "@/components/sections/faq";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col axios-gradient-bg">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FixedRateSection />
        <FeaturesSection />
        <LoanInterface />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
