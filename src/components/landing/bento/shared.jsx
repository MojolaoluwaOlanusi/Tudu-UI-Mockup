import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function useTileInView() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-80px', once: false });
  return { ref, inView };
}

export function useCursorSpotlight(ref) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    const on = () => setActive(true);
    const off = () => setActive(false);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', on);
    el.addEventListener('mouseleave', off);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', on);
      el.removeEventListener('mouseleave', off);
    };
  }, [ref]);
  return { pos, active };
}

export function TileHeader({ title, icon, badge, hint }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        {icon && <span className="shrink-0 text-ink-muted">{icon}</span>}
        <h3 className="truncate text-[13px] font-semibold text-ink">{title}</h3>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {hint && (
          <span className="rounded-sm border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
            {hint}
          </span>
        )}
        {badge && (
          <span className="rounded-sm bg-brand/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export const Cursor = ({ className }) => (
  <span className={cn('ml-0.5 inline-block h-3 w-px animate-pulse bg-brand align-middle', className)} />
);
