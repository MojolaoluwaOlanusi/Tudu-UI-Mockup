import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/store/AppContext';
import TaskDetail from '@/components/app/list/TaskDetail';
import ColumnSettings from '@/components/app/board/ColumnSettings';

export default function DetailPanel() {
  const { detail, closeDetail, tasks, columns } = useApp();
  const open = detail !== null;

  const task =
    detail && detail.type === 'task'
      ? tasks.find((t) => t.id === detail.id && !t.deleted)
      : null;
  const column =
    detail && detail.type === 'column'
      ? columns.find((c) => c.id === detail.id)
      : null;

  const invalid =
    (detail && detail.type === 'task' && !task) ||
    (detail && detail.type === 'column' && !column);

  useEffect(() => {
    if (invalid) closeDetail();
  }, [invalid, closeDetail]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeDetail(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeDetail]);

  const body = !open
    ? null
    : detail.type === 'task' && task
      ? <TaskDetail task={task} onClose={closeDetail} />
      : detail.type === 'column' && column
        ? <ColumnSettings column={column} onClose={closeDetail} />
        : null;

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: open && body ? 384 : 0 }}
        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
        className="relative hidden shrink-0 overflow-hidden rounded-xl border border-line-subtle bg-surface md:block"
      >
        <div className="flex h-full w-96 flex-col">{body}</div>
      </motion.aside>

      <AnimatePresence>
        {open && body && (
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
              className="w-full max-w-sm overflow-hidden rounded-l-2xl bg-surface shadow-2xl"
            >
              <div className="flex h-full flex-col">{body}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}