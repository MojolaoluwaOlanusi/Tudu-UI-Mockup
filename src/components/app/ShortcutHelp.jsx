import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/store/AppContext';

const GROUPS = [
  {
    title: 'Global',
    items: [
      { keys: ['Ctrl', 'K'], label: 'Command palette' },
      { keys: ['?'], label: 'Show this help' },
      { keys: ['Ctrl', 'Shift', 'D'], label: 'Toggle density' },
      { keys: ['Esc'], label: 'Close panel / dismiss' },
    ],
  },
  {
    title: 'Navigation (press G, then key)',
    items: [
      { keys: ['G', 'L'], label: 'Go to List' },
      { keys: ['G', 'B'], label: 'Go to Board' },
      { keys: ['G', 'S'], label: 'Go to Stats' },
      { keys: ['G', 'A'], label: 'Go to Analytics' },
    ],
  },
  {
    title: 'Tasks',
    items: [
      { keys: ['N'], label: 'New task' },
      { keys: ['Ctrl', 'A'], label: 'Select all (in select mode)' },
    ],
  },
];

export default function ShortcutHelp() {
  const { shortcutHelpOpen, closeShortcutHelp } = useApp();

  useEffect(() => {
    if (!shortcutHelpOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeShortcutHelp(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcutHelpOpen, closeShortcutHelp]);

  if (!shortcutHelpOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4"
      onClick={closeShortcutHelp}
      role="presentation"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
          <h2 className="font-handwritten text-2xl text-ink">Keyboard shortcuts</h2>
          <button type="button" onClick={closeShortcutHelp} aria-label="Close" className="rounded-md p-1 text-ink-muted transition-colors hover:bg-subtle hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4 scroll-hidden">
          {GROUPS.map((g) => (
            <section key={g.title} className="mb-5 last:mb-0">
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{g.title}</h3>
              <ul className="space-y-1.5">
                {g.items.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="min-w-0 flex-1 text-ink">{item.label}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      {item.keys.map((k, i) => (
                        <kbd key={i} className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-ink">{k}</kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}