import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    heading: 'Product',
    links: [
      { label: 'Boards & Kanban', to: '/docs/boards' },
      { label: 'Lists & filters', to: '/docs/lists' },
      { label: 'AI breakdown', to: '/docs/ai' },
      { label: 'Templates', to: '/docs/templates' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Freelancers', to: '/solutions/freelancers' },
      { label: 'Small teams', to: '/solutions/teams' },
      { label: 'Enterprise', to: '/solutions/enterprise' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Documentation', to: '/docs' },
      { label: 'Public API', to: '/docs/api' },
      { label: 'Webhooks', to: '/webhooks' },
      { label: 'Changelog', to: '/changelog' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'Help center', to: '/help' },
      { label: 'Community', to: '/community' },
      { label: 'Status', to: '/status' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-visible">
      {/* Giant wordmark — half above the glass panel, half behind it.
          The glass panel's backdrop-blur redraws the bottom half of the
          wordmark as a soft ghost, so the green check "glows" through. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 flex -translate-y-1/2 justify-center"
      >
        <div className="relative flex items-baseline gap-2 sm:gap-3">
          {/* Glow behind the check */}
          <div
            className="absolute left-[58%] top-[40%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-32 sm:w-32 md:h-40 md:w-40"
            style={{
              background:
                'radial-gradient(circle, rgba(34,197,94,0.55) 0%, transparent 65%)',
              filter: 'blur(24px)',
            }}
          />
          <span className="relative font-brand text-[56px] leading-none text-ink sm:text-[80px] md:text-[120px] lg:text-[140px]">
            tudu
          </span>
          <svg
            className="relative h-[38px] w-[38px] shrink-0 -translate-y-1 sm:h-[54px] sm:w-[54px] md:h-[80px] md:w-[80px]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="11" fill="var(--accent)" />
            <path
              d="M6.5 12.5l3.5 3.5 7-7"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Glass panel — starts at y=0 of footer, blurs the bottom half
          of the wordmark via backdrop-filter. */}
      <div className="relative z-10 border-t border-line-subtle bg-canvas/70 backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-32 sm:pt-40 md:pt-48">
          {/* Mobile: 2x3 grid */}
          <div className="grid grid-cols-2 gap-8 md:hidden">
            {SECTIONS.map((sec) => (
              <div key={sec.heading}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  {sec.heading}
                </p>
                <ul className="space-y-2">
                  {sec.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-[12px] text-ink-muted transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Desktop: brand + 5 sections */}
          <div className="hidden gap-8 md:grid md:grid-cols-6">
            <div className="col-span-1">
              <p className="text-[13px] font-semibold text-ink">Tudu</p>
              <p className="mt-2 max-w-[180px] text-[11px] leading-relaxed text-ink-muted">
                Where simple boards become serious work.
              </p>
            </div>
            {SECTIONS.map((sec) => (
              <div key={sec.heading}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  {sec.heading}
                </p>
                <ul className="space-y-2">
                  {sec.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-[12px] text-ink-muted transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-line-subtle pt-6 text-[11px] text-ink-faint md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Tudu. All rights reserved.</p>
            <p className="text-center md:text-right">
              Made with <span className="text-brand">💖</span> in Ibadan.
              <span className="hidden sm:inline">
                {' '}
                No Trello or Jira were harmed — just built what they didn&apos;t.
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
