import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';

export default function ExpiredSessionDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3 border-b border-line-subtle p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <Lock className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold text-ink">Session expired</p>
            <p className="text-[11px] text-ink-faint">Your JWT expired 2 minutes ago</p>
          </div>
        </div>
        <div className="p-5">
          <p className="text-[13px] leading-relaxed text-ink-muted">
            Your last action was saved. Sign in again to pick up exactly where you left off. No unsaved work lost.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-accent brush-stroke w-full">
              Sign in again
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost w-full">
              Dismiss (demo)
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] text-ink-faint">
            Rule 1 demo. Press Ctrl+Shift+E anywhere in the app to see this. Real auth is handled by the backend.
          </p>
        </div>
      </div>
    </div>
  );
}