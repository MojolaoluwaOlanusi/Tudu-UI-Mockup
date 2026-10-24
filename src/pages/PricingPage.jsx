import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';

const PRICING = {
  free: {
    name: 'Free',
    tagline: 'For solo builders getting organized.',
    features: [
      'Unlimited boards & tasks',
      'AI breakdown (100 / mo)',
      'Pomodoro & focus stats',
      'Public read API',
      'Built-in templates',
    ],
    cta: 'Start free',
  },
  pro: {
    name: 'Pro',
    tagline: 'For freelancers and small teams.',
    ngn: { monthly: 7500, yearly: 75000 },
    usd: { monthly: 5, yearly: 50 },
    features: [
      'Everything in Free',
      'Time tracking & team analytics',
      'HD AI breakdown (12 steps)',
      'GitHub + Slack integrations',
      'Public write API + webhooks',
      'Self-hosting license',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  enterprise: {
    name: 'Enterprise',
    tagline: 'For teams 20+ with compliance needs.',
    features: [
      'Everything in Pro',
      'SAML SSO',
      'SCIM provisioning',
      'Audit log export',
      'White-label branding',
      'On-prem deployment',
      'Dedicated support & SLA',
    ],
    cta: 'Contact sales',
    comingSoon: true,
  },
};

function PaystackModal({ plan, amount, onClose, onSuccess }) {
  const [step, setStep] = useState('form');
  useEffect(() => {
    if (step !== 'processing') return;
    const t = setTimeout(() => setStep('success'), 1400);
    return () => clearTimeout(t);
  }, [step]);
  useEffect(() => {
    if (step !== 'success') return;
    onSuccess?.();
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, [step, onClose, onSuccess]);

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4" onClick={onClose} role="presentation">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-lg bg-white text-[#1a1a1a] shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between bg-[#0BA4DB] px-4 py-3 text-white">
          <span className="text-[15px] font-semibold tracking-tight">Paystack</span>
          <span className="rounded-sm bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Test mode</span>
        </div>
        {step === 'form' && (
          <div className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Tudu</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">₦{amount.toLocaleString()}</p>
            <p className="mt-1 text-xs text-gray-500">Billed {plan === 'monthly' ? 'monthly' : 'yearly'}</p>
            <div className="mt-5 space-y-3">
              <input type="email" defaultValue="mojola@tudu.app" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0BA4DB] focus:outline-none" />
              <input type="text" defaultValue="4084 0840 8408 4081" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0BA4DB] focus:outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" defaultValue="08 / 28" className="rounded-md border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0BA4DB] focus:outline-none" />
                <input type="text" defaultValue="408" className="rounded-md border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0BA4DB] focus:outline-none" />
              </div>
            </div>
            <button type="button" onClick={() => setStep('processing')} className="mt-5 w-full rounded-md bg-[#0BA4DB] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0993c7]">
              Pay ₦{amount.toLocaleString()}
            </button>
            <p className="mt-3 text-center text-[10px] text-gray-400">Secured by Paystack - Demo only, no charge</p>
          </div>
        )}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0BA4DB] border-t-transparent" />
            <p className="mt-4 text-sm text-gray-600">Processing payment...</p>
          </div>
        )}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" strokeWidth={3} />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-900">Payment successful</p>
            <p className="mt-1 text-xs text-gray-500">Welcome to Pro - demo only</p>
          </div>
        )}
      </motion.div>
    </div>
  );
  return createPortal(content, document.body);
}

export default function PricingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);
  const [currency, setCurrency] = useState('NGN');
  const [paystack, setPaystack] = useState(null);
  const [mockTier, setMockTier] = useState(() => { try { return localStorage.getItem('tudu-mock-tier'); } catch { return null; } });

  const fromApp = new URLSearchParams(location.search).get('from') === 'app';

  const proPrice = yearly
    ? (currency === 'NGN' ? 75000 : 50)
    : (currency === 'NGN' ? 7500 : 5);
  const sym = currency === 'NGN' ? '₦' : '$';

  const handleUpgrade = () => setPaystack({ plan: yearly ? 'yearly' : 'monthly', amount: yearly ? 75000 : 7500 });
  const handleSuccess = () => { setMockTier('pro'); try { localStorage.setItem('tudu-mock-tier', 'pro'); } catch {} };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {fromApp ? (
        <header className="border-b border-line-subtle">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-6">
            <button type="button" onClick={() => navigate('/app/settings/billing')} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <span className="text-ink-faint">|</span>
            <span className="text-[13px] font-semibold text-ink">Pricing</span>
          </div>
        </header>
      ) : (
        <Navbar />
      )}

      <main className={fromApp ? 'mx-auto max-w-6xl px-6 py-10' : 'mx-auto max-w-6xl px-6 pt-24 pb-16'}>
        <div className="mb-10 text-center">
          <h1 className="font-handwritten text-4xl text-ink sm:text-5xl">Simple pricing. Real limits.</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink-muted">
            Free forever for personal use. Upgrade when you need teammates, integrations, or volume.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex rounded-lg border border-line bg-surface p-1">
            {[false, true].map((y) => (
              <button key={String(y)} type="button" onClick={() => setYearly(y)} className="relative rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors">
                {yearly === y && <motion.div layoutId="pricing-period" className="absolute inset-0 rounded-md bg-raised" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className={'relative z-10 ' + (yearly === y ? 'text-ink' : 'text-ink-muted')}>{y ? 'Yearly' : 'Monthly'}</span>
                {y && <span className="relative z-10 ml-1.5 rounded-sm bg-brand/15 px-1 text-[9px] font-semibold uppercase tracking-wider text-brand">Save 2mo</span>}
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-lg border border-line bg-surface p-1">
            {['NGN', 'USD'].map((cur) => (
              <button key={cur} type="button" onClick={() => setCurrency(cur)} className="relative rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors">
                {currency === cur && <motion.div layoutId="pricing-currency" className="absolute inset-0 rounded-md bg-raised" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className={'relative z-10 ' + (currency === cur ? 'text-ink' : 'text-ink-muted')}>{cur}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {['free', 'pro', 'enterprise'].map((key) => {
            const p = PRICING[key];
            return (
              <div
                key={key}
                className={
                  'relative flex flex-col rounded-xl border p-6 transition-colors ' +
                  (p.highlight ? 'border-brand/60 bg-brand-subtle/20 ring-1 ring-brand/30' : 'border-line bg-surface') +
                  (p.comingSoon ? ' opacity-60' : '')
                }
              >
                {p.highlight && (
                  <span className="absolute -top-2.5 left-4 rounded-sm bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-inverse">Most popular</span>
                )}
                {p.comingSoon && (
                  <span className="absolute -top-2.5 left-4 rounded-sm bg-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Coming soon</span>
                )}
                <h2 className="font-handwritten text-2xl text-ink">{p.name}</h2>
                <p className="mt-1 text-[12px] text-ink-muted">{p.tagline}</p>
                <div className="my-5 min-h-[64px]">
                  {key === 'free' && <p className="font-handwritten text-4xl text-ink">₦0</p>}
                  {key === 'pro' && (
                    <>
                      <p className="font-handwritten text-4xl text-ink tabular-nums">{sym}{proPrice.toLocaleString()}<span className="ml-1 font-sans text-sm text-ink-muted">/{yearly ? 'year' : 'month'}</span></p>
                      {yearly && <p className="mt-1 text-[11px] text-ink-faint">~ {sym}{Math.round(proPrice / 12).toLocaleString()}/mo</p>}
                      <p className="mt-1 text-[10px] text-ink-faint">Charged ₦{(yearly ? 75000 : 7500).toLocaleString()} NGN</p>
                    </>
                  )}
                  {key === 'enterprise' && <p className="font-handwritten text-4xl text-ink">Custom</p>}
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12px]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2.5} />
                      <span className="text-ink-muted">{f}</span>
                    </li>
                  ))}
                </ul>
                {key === 'free' && (
                  <Link to="/signup" className="w-full rounded-md border border-line px-4 py-2 text-center text-sm font-medium text-ink transition-colors hover:bg-subtle">Start free</Link>
                )}
                {key === 'pro' && (
                  mockTier === 'pro' ? (
                    <div className="flex items-center justify-center gap-1.5 rounded-md border border-brand/40 bg-brand-subtle px-4 py-2 text-sm font-medium text-brand">
                      <Check className="h-4 w-4" strokeWidth={2.5} /> You are on Pro
                    </div>
                  ) : (
                    <button type="button" onClick={handleUpgrade} className="btn-accent brush-stroke w-full">Upgrade to Pro</button>
                  )
                )}
                {key === 'enterprise' && (
                  <button type="button" disabled className="w-full cursor-not-allowed rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-faint">Contact sales</button>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[11px] text-ink-faint">
          Payments are processed by Paystack. Cancel any time from your billing settings.
        </p>
      </main>

      {paystack && (
        <PaystackModal plan={paystack.plan} amount={paystack.amount} onClose={() => setPaystack(null)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}