import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import LogoStrip from '@/components/landing/LogoStrip';
import ProblemSection from '@/components/landing/ProblemSection';
import BentoGrid from '@/components/landing/BentoGrid';
import HowItWorks from '@/components/landing/HowItWorks';
import UnderTheHood from '@/components/landing/UnderTheHood';

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
        <section className="min-h-[120vh] border-t border-line-subtle flex items-center justify-center">
          <p className="text-xs text-ink-faint">
            Scroll up to test the sticky-glass navbar.
          </p>
        </section>
      </main>
    </div>
  );
}
