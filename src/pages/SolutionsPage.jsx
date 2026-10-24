import { Link, useParams } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import MarketingShell from '@/components/marketing/MarketingShell';
import { H1, P } from '@/components/marketing/Prose';

const CONTENT = {
  freelancers: {
    eyebrow: 'For freelancers',
    title: 'Ship client work without a project manager.',
    tagline: 'One board per client. Time tracking built in. Invoice-ready exports.',
    features: [
      { title: 'Client boards', desc: 'One board per client with isolated columns.' },
      { title: 'Time tracking', desc: 'Log billable hours against any task. Export CSV.' },
      { title: 'Proposals that turn into tasks', desc: 'AI breakdown splits scope into checkable steps.' },
      { title: 'Templates', desc: 'Start from the Freelancer template in two clicks.' },
    ],
    cta: 'Start free',
    ctaHref: '/signup',
  },
  teams: {
    eyebrow: 'For small teams',
    title: 'One board your whole team actually opens.',
    tagline: 'Workspaces, roles, real-time sync, and per-member analytics.',
    features: [
      { title: 'Workspaces', desc: 'Separate work per client, product line, or department.' },
      { title: 'Roles', desc: 'Admin, member, viewer. Enforced on every endpoint.' },
      { title: 'Shared boards', desc: 'Granular sharing with view or edit access.' },
      { title: 'Team analytics', desc: 'Per-member completion rates and burndown.' },
    ],
    cta: 'Start free',
    ctaHref: '/signup',
  },
  enterprise: {
    eyebrow: 'Coming soon',
    title: 'Compliance-grade Kanban.',
    tagline: 'SAML SSO, SCIM, audit logs, on-prem deployment. Contact us to be first in line.',
    features: [
      { title: 'SAML SSO', desc: 'Okta, Azure AD, Google Workspace.' },
      { title: 'SCIM provisioning', desc: 'Auto-sync users from your IdP.' },
      { title: 'Audit log export', desc: 'Every action, signed and exportable.' },
      { title: 'On-prem', desc: 'Run Tudu behind your firewall with a self-hosted license.' },
    ],
    cta: 'Contact sales',
    ctaHref: '/contact',
  },
};

export default function SolutionsPage() {
  const { slug } = useParams();
  const content = CONTENT[slug] || CONTENT.teams;

  return (
    <MarketingShell>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            {content.eyebrow}
          </p>
          <H1>{content.title}</H1>
          <P>{content.tagline}</P>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {content.features.map((f) => (
            <div key={f.title} className="rounded-lg border border-line bg-surface p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-subtle text-brand">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <p className="mt-3 text-sm font-medium text-ink">{f.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link to={content.ctaHref} className="btn-accent brush-stroke px-5 py-2.5">
            {content.cta}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <Link to="/pricing" className="btn-ghost">See pricing</Link>
        </div>
      </div>
    </MarketingShell>
  );
}