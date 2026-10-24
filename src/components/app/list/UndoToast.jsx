import { motion } from 'framer-motion';
import { useApp } from '@/store/AppContext';

export default function UndoToast() {
  const { undoToast, undoDelete, clearUndo } = useApp();
  if (!undoToast) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4"
    >
      <div className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-line bg-surface px-3 py-2 shadow-xl">
        <span className="max-w-[16rem] truncate text-[12px] text-ink-muted">
          Deleted <span className="font-medium text-ink">{undoToast.title}</span>
        </span>
        <button
          type="button"
          onClick={undoDelete}
          className="rounded-md bg-brand px-2.5 py-1 text-[11px] font-semibold text-ink-inverse transition-colors hover:bg-brand-hover"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={clearUndo}
          aria-label="Dismiss"
          className="text-[11px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          x
        </button>
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 10, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-0.5 bg-brand"
        />
      </div>
    </motion.div>
  );
}