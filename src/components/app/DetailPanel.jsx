import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/store/AppContext';

function DetailContent({ detail, onClose }) {
  const title =
    detail?.type === 'task'
      ? 'Task detail'
      : detail?.type === 'board'
        ? 'Board'
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
      <div className="flex-1 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-6 text-center">
          <div className="max-w-[280px]">
            <p className="text-sm font-medium text-ink">
              {detail?.title || 'Nothing selected'}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              Full detail content lands in Part 10. Press Esc or click the close
              button to dismiss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailPanel() {
  const { detail, closeDetail } = useApp();
  const open = detail !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeDetail]);

  return (
    <>
      {/* Desktop: inline panel, animated width */}
      <aside
        className={
          'hidden shrink-0 overflow-hidden border-l border-line-subtle bg-surface transition-[width] duration-200 ease-out md:block ' +
          (open ? 'w-96' : 'w-0')
        }
      >
        <div className="flex h-full w-96 flex-col">
          {open && <DetailContent detail={detail} onClose={closeDetail} />}
        </div>
      </aside>

      {/* Mobile: full-screen slide-over */}
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
              <DetailContent detail={detail} onClose={closeDetail} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}