import { NavLink, Outlet } from 'react-router-dom';

const SECTIONS = [
  { slug: 'account', label: 'Account' },
  { slug: 'notifications', label: 'Notifications' },
  { slug: 'appearance', label: 'Appearance' },
  { slug: 'integrations', label: 'Integrations' },
  { slug: 'workspace', label: 'Workspace' },
  { slug: 'billing', label: 'Billing' },
  { slug: 'license', label: 'License' },
  { slug: 'api', label: 'API' },
  { slug: 'webhooks', label: 'Webhooks' },
];

export default function AppSettings() {
  return (
    <div className="flex h-full">
      <nav className="w-56 shrink-0 overflow-y-auto border-r border-line-subtle p-2 scroll-hidden">
        <p className="mb-2 px-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          Settings
        </p>
        {SECTIONS.map((s) => (
          <NavLink
            key={s.slug}
            to={'/app/settings/' + s.slug}
            className={({ isActive }) =>
              'block rounded-md px-2 py-1.5 text-[13px] transition-colors ' +
              (isActive ? 'bg-brand-subtle text-brand' : 'text-ink-muted hover:bg-subtle hover:text-ink')
            }
          >
            {s.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
}