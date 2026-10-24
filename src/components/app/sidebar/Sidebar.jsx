import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, Plus, MoreHorizontal, Mail, Users, Send, ArrowUp, ArrowDown } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import BoardList from './BoardList';
import SharedRow from './SharedRow';
import { INVITES, SHARED_WITH_ME, SHARED_BY_ME } from '@/lib/mockData';

const COLLAPSE_KEY = 'tudu-sidebar-collapsed';
const W_EXPANDED = 256;
const W_COLLAPSED = 56;
const EASE = [0.2, 0, 0, 1];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(COLLAPSE_KEY) === '1'; } catch { return false; }
  });
  const [atRecent, setAtRecent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  useEffect(() => {
    const main = document.querySelector('[data-main]');
    if (!main) return;
    const onScroll = () => {
      setAtRecent(main.scrollTop + main.clientHeight >= main.scrollHeight - 120);
    };
    main.addEventListener('scroll', onScroll);
    onScroll();
    return () => main.removeEventListener('scroll', onScroll);
  }, []);

  const handleRecentActivity = () => {
    const main = document.querySelector('[data-main]');
    if (!main) return;
    if (atRecent) {
      main.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById('recent-activity');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? W_COLLAPSED : W_EXPANDED }}
      transition={{ duration: 0.24, ease: EASE }}
      className="relative hidden shrink-0 overflow-hidden rounded-xl border border-line-subtle bg-surface lg:block"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {collapsed ? (
          <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="absolute inset-0 flex flex-col">
            <div className="flex h-12 shrink-0 items-center justify-center border-b border-line-subtle">
              <button type="button" onClick={() => setCollapsed(false)} title="Expand sidebar" aria-label="Expand sidebar" className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink">
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scroll-hidden">
              <BoardList collapsed />
              <div className="my-2 border-t border-line-subtle" />
              <div className="flex flex-col items-center gap-1 px-2 py-1">
                <button type="button" onClick={() => navigate('/app')} title={'Invitations (' + INVITES.length + ')'} aria-label={'Invitations (' + INVITES.length + ')'} className="relative flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink">
                  <Mail className="h-4 w-4" />
                  {INVITES.length > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />}
                </button>
                <button type="button" onClick={() => navigate('/app')} title={'Shared with me (' + SHARED_WITH_ME.length + ')'} aria-label={'Shared with me (' + SHARED_WITH_ME.length + ')'} className="relative flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink">
                  <Users className="h-4 w-4" />
                  {SHARED_WITH_ME.length > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />}
                </button>
                <button type="button" onClick={() => navigate('/app')} title={'Shared by me (' + SHARED_BY_ME.length + ')'} aria-label={'Shared by me (' + SHARED_BY_ME.length + ')'} className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="my-2 border-t border-line-subtle" />
              <div className="flex justify-center px-2">
                <button type="button" onClick={handleRecentActivity} title={atRecent ? 'Back to top' : 'Jump to recent activity'} aria-label={atRecent ? 'Back to top' : 'Jump to recent activity'} className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink">
                  {atRecent ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="absolute inset-0 flex flex-col">
            <div className="flex h-12 shrink-0 items-center gap-1 border-b border-line-subtle px-2">
              <span className="flex-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Boards</span>
              <button type="button" onClick={() => {}} title="New board" aria-label="New board" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink"><Plus className="h-4 w-4" /></button>
              <button type="button" onClick={() => {}} title="Board actions" aria-label="Board actions" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink"><MoreHorizontal className="h-4 w-4" /></button>
              <button type="button" onClick={() => setCollapsed(true)} title="Collapse sidebar" aria-label="Collapse sidebar" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink"><PanelLeftClose className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto scroll-hidden">
              <BoardList collapsed={false} />
              <CollapsibleSection title="Invitations" badge={INVITES.length}>
                <ul>
                  {INVITES.map((inv) => (
                    <li key={inv.id}><SharedRow name={inv.owner} initials={inv.initials} meta={inv.permission === 'edit' ? 'can edit' : 'view only'} badge={inv.taskCount} onClick={() => {}} /></li>
                  ))}
                </ul>
              </CollapsibleSection>
              <CollapsibleSection title="Shared with me" badge={SHARED_WITH_ME.length}>
                <ul>
                  {SHARED_WITH_ME.map((s) => (
                    <li key={s.id}><SharedRow name={s.owner} initials={s.initials} meta={s.completedCount + '/' + s.taskCount + ' done'} onClick={() => navigate('/app/shared/' + s.id)} /></li>
                  ))}
                </ul>
              </CollapsibleSection>
              <CollapsibleSection title="Shared by me" badge={SHARED_BY_ME.length}>
                <ul>
                  {SHARED_BY_ME.map((s) => (
                    <li key={s.id}><SharedRow name={s.sharedWith} initials={s.initials} meta={s.status} onClick={() => {}} /></li>
                  ))}
                </ul>
              </CollapsibleSection>
              <button type="button" onClick={handleRecentActivity} className="flex w-full items-center gap-2 border-t border-line-subtle px-3 py-2 text-left transition-colors hover:bg-subtle/50">
                {atRecent ? <ArrowUp className="h-3 w-3 shrink-0 text-ink-faint" /> : <ArrowDown className="h-3 w-3 shrink-0 text-ink-faint" />}
                <span className="flex-1 truncate text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Recent activity</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}