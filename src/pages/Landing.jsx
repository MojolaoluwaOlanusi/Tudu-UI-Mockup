import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import LogoStrip from '@/components/landing/LogoStrip';
import ProblemSection from '@/components/landing/ProblemSection';
import BentoGrid from '@/components/landing/BentoGrid';
import HowItWorks from '@/components/landing/HowItWorks';
import UnderTheHood from '@/components/landing/UnderTheHood';
import TierGating from '@/components/landing/TierGating';
import PricingSection from '@/components/landing/PricingSection';
import Changelog from '@/components/landing/Changelog';
import SocialProof from '@/components/landing/SocialProof';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="pt-14">
        <Hero />
        <LogoStrip />
        <ProblemSection />
        <BentoGrid />
        <HowItWorks />
        <UnderTheHood />
        <TierGating />
        <PricingSection />
        <Changelog />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
