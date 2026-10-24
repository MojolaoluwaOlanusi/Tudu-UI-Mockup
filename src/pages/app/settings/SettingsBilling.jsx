import { useApp } from '@/store/AppContext';
import { MOCK_PAYMENTS } from '@/lib/mockSettings';
import { PageHeader, Section, Pill } from './primitives';

function naira(kobo) {
  return '₦' + (kobo / 100).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SettingsBilling() {
  const { pushToast } = useApp();
  const tier = (() => { try { return localStorage.getItem('tudu-mock-tier') || 'free'; } catch { return 'free'; } })();

  return (
    <>
      <PageHeader title="Billing" description="Your plan, credits, and payment history." />

      <Section title="Current plan">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Plan</p>
            <p className="mt-1 font-handwritten text-2xl text-ink">{tier === 'pro' ? 'Pro' : 'Free'}</p>
            {tier === 'pro' && <p className="mt-1 text-[11px] text-ink-faint">Renews on Nov 22, 2026</p>}
          </div>
          {tier === 'pro' ? (
            <button type="button" onClick={() => pushToast('Cancel subscription (mock).', 'info')} className="btn-ghost !py-1.5 !text-[12px]">Cancel subscription</button>
          ) : (
            <a href="#/pricing?from=app" className="btn-accent !py-1.5 !text-[12px]">Upgrade to Pro</a>
          )}
        </div>
      </Section>

      <Section title="AI credits">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-handwritten text-2xl text-ink">87</p>
            <p className="text-[11px] text-ink-faint">Credits remaining - never expire</p>
          </div>
          <button type="button" onClick={() => pushToast('Buy credits (mock).', 'info')} className="btn-ghost !py-1.5 !text-[12px]">Buy more</button>
        </div>
      </Section>

      <Section title="Payment history">
        <ul className="space-y-2">
          {MOCK_PAYMENTS.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-line-subtle bg-canvas p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{p.purpose === 'subscription' ? 'Tudu Pro subscription' : 'AI credits purchase'}</p>
                <p className="truncate text-[11px] text-ink-faint">{fmtDate(p.created_at)} - {p.reference}</p>
              </div>
              <span className="shrink-0 text-sm font-medium text-ink tabular-nums">{naira(p.amount_kobo)}</span>
              <Pill tone="brand">{p.status}</Pill>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}