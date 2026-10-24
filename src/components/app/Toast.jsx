import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '@/store/AppContext';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'text-brand',
  error: 'text-red-400',
  info: 'text-ink-muted',
};

export default function ToastStack() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-20 z-40 flex flex-col items-center gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant] || ICONS.info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto flex max-w-md items-start gap-2 rounded-lg border border-line bg-surface px-3 py-2 shadow-lg"
            >
              <Icon className={'mt-0.5 h-4 w-4 shrink-0 ' + (COLORS[t.variant] || COLORS.info)} />
              <p className="min-w-0 flex-1 text-[12px] text-ink">{t.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss"
                className="shrink-0 text-[11px] font-medium text-ink-muted transition-colors hover:text-ink"
              >
                x
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}