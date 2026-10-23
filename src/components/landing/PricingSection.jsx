import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrushButton from '@/components/ui/BrushButton';
import { cn } from '@/lib/utils';

const PRICING_DATA = {
  free: {
    name: 'Free',
    tagline: 'For solo builders getting organized.',
    ngn: { monthly: 0, yearly: 0 },
    usd: { monthly: 0, yearly: 0 },
    features: [
      'Unlimited boards & tasks',
      'AI breakdown (100 / mo)',
      'Pomodoro & focus stats',
      'Public API (read)',
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
      'Webhooks + public write API',
      'Publish templates & sell',
      'Self-hosting license',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  enterprise: {
    name: 'Enterprise',
    tagline: 'For teams 20+ with compliance needs.',
    comingSoon: true,
    features: [
      'Everything in Pro',
      'SAML SSO (Okta, Azure)',
      'SCIM provisioning',
      'Compliance audit export',
      'White-label branding',
      'On-prem deployment',
      'Dedicated support & SLA',
    ],
    cta: 'Contact sales',
  },
};

function PaystackModal({ plan, amount, onClose }) {
  const [step, setStep] = useState('form');

  useEffect(() => {
    if (step !== 'processing') return;
    const t = setTimeout(() => setStep('success'), 1500);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 'success') return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [step, onClose]);

  const content = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-lg bg-white text-[#1a1a1a] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Paystack checkout"
      >
        <div className="flex items-center justify-between bg-[#0BA4DB] px-4 py-3 text-white">
          <span className="text-[15px] font-semibold tracking-tight">Paystack</span>
          <span className="rounded-sm bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Test mode
          </span>
        </div>

        {step === 'form' && (
          <div className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Tudu</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              ₦{amount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Billed {plan === 'monthly' ? 'monthly' : 'yearly'}
            </p>

            <div className="mt-5 space-y-3">
              <input
                type="email"
                defaultValue="demo@tudu.app"
                placeholder="Email"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0BA4DB] focus:outline-none"
              />
              <input
                type="text"
                defaultValue="4084 0840 8408 4081"
                placeholder="Card number"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0BA4DB] focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  defaultValue="08 / 28"
                  placeholder="MM / YY"
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0BA4DB] focus:outline-none"
                />
                <input
                  type="text"
                  defaultValue="408"
                  placeholder="CVV"
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0BA4DB] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('processing')}
              className="mt-5 w-full rounded-md bg-[#0BA4DB] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0993c7]"
            >
              Pay ₦{amount.toLocaleString()}
            </button>
            <p className="mt-3 text-center text-[10px] text-gray-400">
              Secured by Paystack · Demo only, no charge
            </p>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0BA4DB] border-t-transparent" />
            <p className="mt-4 text-sm text-gray-600">Processing payment…</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" strokeWidth={3} />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-900">Payment successful</p>
            <p className="mt-1 text-xs text-gray-500">Welcome to Pro · demo only</p>
          </div>
        )}
      </motion.div>
    </div>
  );

  return createPortal(content, document.body);
}

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const [currency, setCurrency] = useState('NGN');
  const [paystack, setPaystack] = useState(null);
  const navigate = useNavigate();

  const getPrice = (key) => {
    const d = PRICING_DATA[key];
    if (!d.ngn) return null;
    return {
      value: currency === 'NGN' ? d.ngn[yearly ? 'yearly' : 'monthly'] : d.usd[yearly ? 'yearly' : 'monthly'],
      symbol: currency === 'NGN' ? '₦' : '$',
    };
  };

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          Pricing
        </p>
        <h2 className="text-balance text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Simple pricing. Real limits.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          Free forever for personal use. Upgrade when you need teammates,
          integrations, or volume.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-line bg-surface p-1">
          {[
            { key: false, label: 'Monthly' },
            { key: true, label: 'Yearly', save: true },
          ].map((opt) => (
            <button
              key={String(opt.key)}
              type="button"
              onClick={() => setYearly(opt.key)}
              className={cn(
                'relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                yearly === opt.key ? 'text-ink' : 'text-ink-muted'
              )}
            >
              {yearly === opt.key && (
                <motion.div
                  layoutId="yearly-toggle"
                  className="absolute inset-0 rounded-md bg-raised"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
              {opt.save && (
                <span className="relative z-10 ml-1.5 rounded-sm bg-brand/15 px-1 text-[9px] font-semibold uppercase tracking-wider text-brand">
                  Save 2mo
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-line bg-surface p-1">
          {['NGN', 'USD'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={cn(
                'relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                currency === c ? 'text-ink' : 'text-ink-muted'
              )}
            >
              {currency === c && (
                <motion.div
                  layoutId="currency-toggle"
                  className="absolute inset-0 rounded-md bg-raised"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {['free', 'pro', 'enterprise'].map((key) => {
          const data = PRICING_DATA[key];
          const price = getPrice(key);
          const highlight = data.highlight;
          return (
            <div
              key={key}
              className={cn(
                'relative flex flex-col rounded-xl border p-6 transition-colors',
                highlight
                  ? 'border-brand/60 bg-brand-subtle/20 ring-1 ring-brand/30'
                  : 'border-line bg-surface',
                data.comingSoon && 'opacity-60'
              )}
            >
              {highlight && (
                <span className="absolute -top-2.5 left-4 rounded-sm bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-inverse">
                  Most popular
                </span>
              )}
              {data.comingSoon && (
                <span className="absolute -top-2.5 left-4 rounded-sm bg-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Coming soon
                </span>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-ink">{data.name}</h3>
                <p className="mt-1 text-xs text-ink-muted">{data.tagline}</p>
              </div>

              <div className="mb-5 min-h-[70px]">
                {price ? (
                  <>
                    <motion.p
                      key={`${currency}-${yearly}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-4xl font-semibold text-ink tabular-nums"
                    >
                      {price.symbol}{price.value.toLocaleString()}
                      <span className="ml-1 text-sm font-normal text-ink-muted">
                        /{yearly ? 'year' : 'month'}
                      </span>
                    </motion.p>
                    {yearly && key === 'pro' && (
                      <p className="mt-1 text-[11px] text-ink-faint">
                        ≈ {price.symbol}{Math.round(price.value / 12).toLocaleString()}/mo
                      </p>
                    )}
                    {key === 'pro' && (
                      <p className="mt-1 text-[10px] text-ink-faint">
                        Charged ₦{(yearly ? 75000 : 7500).toLocaleString()} NGN
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-3xl font-semibold text-ink">Custom</p>
                )}
              </div>

              <ul className="mb-6 flex-1 space-y-2">
                {data.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12px]">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2.5} />
                    <span className="text-ink-muted">{f}</span>
                  </li>
                ))}
              </ul>

              {key === 'free' && (
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-full rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subtle"
                >
                  {data.cta}
                </button>
              )}
              {key === 'pro' && (
                <BrushButton
                  onClick={() =>
                    setPaystack({
                      plan: yearly ? 'yearly' : 'monthly',
                      amount: yearly ? 75000 : 7500,
                    })
                  }
                  className="w-full"
                >
                  {data.cta}
                </BrushButton>
              )}
              {key === 'enterprise' && (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-faint"
                >
                  {data.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {paystack && (
        <PaystackModal
          plan={paystack.plan}
          amount={paystack.amount}
          onClose={() => setPaystack(null)}
        />
      )}
    </section>
  );
}
