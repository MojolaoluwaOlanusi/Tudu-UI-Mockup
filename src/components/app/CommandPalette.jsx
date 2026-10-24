import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, List, KanbanSquare, BarChart3, PieChart, Settings, Plus, Moon, HelpCircle } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { applyTheme, getTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const GROUP_ORDER = ['Actions', 'Navigation', 'Tasks'];

export default function CommandPalette() {
  const {
    commandPaletteOpen, closeCommandPalette,
    openComposer, openShortcutHelp, openDetail,
    tasks,
  } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    setQuery('');
    setActiveIdx(0);
    setTimeout(() => inputRef.current?.focus(), 20);
  }, [commandPaletteOpen]);

  const items = useMemo(() => {
    if (!commandPaletteOpen) return [];
    const close = () => closeCommandPalette();

    const actions = [
      { id: 'act-new', group: 'Actions', label: 'New task', hint: 'N', icon: Plus, run: () => { close(); openComposer(); } },
      { id: 'act-theme', group: 'Actions', label: 'Toggle theme', hint: '', icon: Moon, run: () => { close(); applyTheme(getTheme() === 'dark' ? 'light' : 'dark'); } },
      { id: 'act-help', group: 'Actions', label: 'Keyboard shortcuts', hint: '?', icon: HelpCircle, run: () => { close(); openShortcutHelp(); } },
    ];
    const nav = [
      { id: 'nav-list', group: 'Navigation', label: 'Go to List', hint: 'G L', icon: List, run: () => { close(); navigate('/app'); } },
      { id: 'nav-board', group: 'Navigation', label: 'Go to Board', hint: 'G B', icon: KanbanSquare, run: () => { close(); navigate('/app/board'); } },
      { id: 'nav-stats', group: 'Navigation', label: 'Go to Stats', hint: 'G S', icon: BarChart3, run: () => { close(); navigate('/app/stats'); } },
      { id: 'nav-analytics', group: 'Navigation', label: 'Go to Analytics', hint: 'G A', icon: PieChart, run: () => { close(); navigate('/app/analytics'); } },
      { id: 'nav-settings', group: 'Navigation', label: 'Go to Settings', hint: '', icon: Settings, run: () => { close(); navigate('/app/settings/account'); } },
    ];
    const taskItems = tasks
      .filter((t) => !t.deleted)
      .slice(0, 30)
      .map((t) => ({ id: 'task-' + t.id, group: 'Tasks', label: t.title, hint: t.status, icon: null, run: () => { close(); openDetail({ type: 'task', id: t.id }); } }));

    return [...actions, ...nav, ...taskItems];
  }, [commandPaletteOpen, tasks, closeCommandPalette, openComposer, openShortcutHelp, openDetail, navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 12);
    return items.filter((i) => i.label.toLowerCase().includes(q) || (i.hint || '').toLowerCase().includes(q)).slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    if (activeIdx >= filtered.length) setActiveIdx(0);
  }, [filtered.length, activeIdx]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); return; }
    if (e.key === 'Enter') { e.preventDefault(); filtered[activeIdx]?.run(); return; }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeCommandPalette(); return; }
  };

  if (!commandPaletteOpen) return null;

  const grouped = filtered.reduce((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  let flatIdx = -1;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center bg-black/50 p-4 pt-[15vh]"
      onClick={closeCommandPalette}
      role="presentation"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-2 border-b border-line-subtle px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-ink-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search or jump to..."
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="shrink-0 rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">Esc</kbd>
        </div>

        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-[12px] text-ink-faint">No matches.</p>
        ) : (
          <ul ref={listRef} className="max-h-[50vh] overflow-y-auto py-1 scroll-hidden">
            {GROUP_ORDER.filter((g) => grouped[g]?.length).map((g) => (
              <li key={g}>
                <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{g}</p>
                <ul>
                  {grouped[g].map((item) => {
                    flatIdx += 1;
                    const idx = flatIdx;
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={item.run}
                          className={cn(
                            'flex w-full items-center gap-3 px-4 py-2 text-left text-[13px] transition-colors',
                            idx === activeIdx ? 'bg-brand-subtle text-ink' : 'text-ink-muted hover:bg-subtle'
                          )}
                        >
                          {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" />}
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.hint && <kbd className="shrink-0 rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">{item.hint}</kbd>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}