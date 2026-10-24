import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import TaskDetail from '@/components/app/list/TaskDetail';

function FallbackDetail({ detail, onClose }) {
  const title =
    detail?.type === 'board'
      ? 'Board settings'
      : detail?.type
        ? detail.type
        : 'Detail';
  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-line-subtle px-4">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          {title}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 text-center">
        <p className="max-w-[280px] text-sm text-ink-muted">
          {detail?.title || 'Coming soon'}
        </p>
      </div>
    </div>
  );
}

export default function DetailPanel() {
  const { detail, closeDetail, tasks } = useApp();
  const open = detail !== null;

  const task =
    detail && detail.type === 'task'
      ? tasks.find((t) => t.id === detail.id && !t.deleted)
      : null;

  useEffect(() => {
    if (detail?.type === 'task' && !task) {
      closeDetail();
    }
  }, [detail, task, closeDetail]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeDetail]);

  const body = !open ? null : detail.type === 'task' && task ? (
    <TaskDetail task={task} onClose={closeDetail} />
  ) : (
    <FallbackDetail detail={detail} onClose={closeDetail} />
  );

  return (
    <>
      <aside
        className={
          'hidden shrink-0 overflow-hidden border-l border-line-subtle bg-surface transition-[width] duration-200 ease-out md:block ' +
          (open ? 'w-96' : 'w-0')
        }
      >
        <div className="flex h-full w-96 flex-col">{body}</div>
      </aside>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex md:hidden"
          >
            <div className="flex-1 bg-black/50" onClick={closeDetail} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="w-full max-w-sm bg-surface shadow-2xl"
            >
              <div className="flex h-full flex-col">{body}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}