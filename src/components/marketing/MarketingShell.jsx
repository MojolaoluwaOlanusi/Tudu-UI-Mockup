import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function MarketingShell({ children }) {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="pt-14">{children}</main>
      <Footer />
    </div>
  );
}