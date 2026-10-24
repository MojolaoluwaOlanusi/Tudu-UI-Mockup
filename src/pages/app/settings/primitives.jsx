export function PageHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h1 className="font-handwritten text-3xl leading-none text-ink sm:text-4xl">{title}</h1>
      {description && <p className="mt-2 text-[12px] text-ink-faint">{description}</p>}
    </div>
  );
}

export function Section({ title, description, children }) {
  return (
    <section className="card mb-4 p-5">
      <h2 className="font-handwritten text-xl text-ink">{title}</h2>
      {description && <p className="mt-1 text-[12px] text-ink-faint">{description}</p>}
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function Field({ label, hint, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-ink-faint">{hint}</p>}
    </div>
  );
}

export function ToggleRow({ title, description, checked, onChange, disabled }) {
  return (
    <label className={'flex cursor-pointer items-start gap-3 rounded-lg border border-line-subtle bg-canvas p-3 ' + (disabled ? 'opacity-60 cursor-not-allowed' : '')}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className="mt-1 h-4 w-4 accent-brand" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description && <p className="mt-0.5 text-[12px] text-ink-muted">{description}</p>}
      </div>
    </label>
  );
}

export function Avatar({ name, size = 8 }) {
  const cls = size === 12 ? 'h-12 w-12 text-sm' : size === 10 ? 'h-10 w-10 text-xs' : 'h-8 w-8 text-[11px]';
  return (
    <span className={'flex shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-ink-inverse ' + cls}>
      {(name || '?').charAt(0).toUpperCase()}
    </span>
  );
}

export function Pill({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-line-subtle text-ink-muted',
    brand: 'bg-brand-subtle text-brand',
    warn: 'bg-amber-500/15 text-amber-400',
    danger: 'bg-red-500/15 text-red-400',
  };
  return (
    <span className={'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ' + (tones[tone] || tones.default)}>
      {children}
    </span>
  );
}