import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function GroupHeader({ label, count }) {
  const [open, setOpen] = useState(true);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="flex h-9 w-full items-center gap-1.5 border-b border-line-subtle px-3 text-left transition-colors hover:bg-subtle/30"
    >
      <ChevronDown
        className={
          'h-3 w-3 shrink-0 text-ink-faint transition-transform ' +
          (open ? '' : '-rotate-90')
        }
      />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <span className="text-[11px] font-medium text-ink-faint tabular-nums">{count}</span>
    </button>
  );
}