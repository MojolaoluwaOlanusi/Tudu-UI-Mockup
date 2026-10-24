import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Timer as TimerIcon, AlertCircle, ListChecks, GripVertical } from 'lucide-react';

const PRIORITY_STYLE = {
  high: 'bg-red-500/15 text-red-400',
  medium: 'bg-amber-500/15 text-amber-400',
  low: 'bg-line-subtle text-ink-muted',
};
const PRIORITY_LETTER = { high: 'H', medium: 'M', low: 'L' };

function isOverdue(task) {
  if (!task.due_date || task.status === 'done') return false;
  return new Date(task.due_date).getTime() < Date.now();
}

function formatDue(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function BoardCardVisual({ task }) {
  const overdue = isOverdue(task);
  const subtaskTotal = (task.subtasks || []).length;
  const subtaskDone = (task.subtasks || []).filter((s) => s.completed).length;
  return (
    <div className="rounded-lg border border-line bg-surface p-2.5 shadow-sm">
      <div className="flex items-start gap-1.5">
        <span
          className={
            'mt-1.5 h-3 w-3 shrink-0 rounded-full border ' +
            (task.status === 'done'
              ? 'border-brand bg-brand'
              : task.status === 'doing'
                ? 'border-doing bg-doing'
                : 'border-line-strong')
          }
        />
        <p
          className={
            'min-w-0 flex-1 text-[12px] font-medium leading-snug ' +
            (task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink')
          }
        >
          {task.title}
        </p>
        {task.priority && (
          <span
            className={
              'shrink-0 rounded-sm px-1 text-[10px] font-semibold ' +
              (PRIORITY_STYLE[task.priority] || 'bg-line-subtle text-ink-muted')
            }
          >
            {PRIORITY_LETTER[task.priority] || '?'}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-[18px] text-[10px] text-ink-faint">
        {task.category && <span>#{task.category}</span>}
        {task.due_date && (
          <span className={overdue ? 'inline-flex items-center gap-0.5 text-red-400' : ''}>
            {overdue && <AlertCircle className="h-2.5 w-2.5" />}
            {formatDue(task.due_date)}
          </span>
        )}
        {subtaskTotal > 0 && (
          <span className="inline-flex items-center gap-0.5">
            <ListChecks className="h-2.5 w-2.5" />
            {subtaskDone}/{subtaskTotal}
          </span>
        )}
        {task.timerRunning && <TimerIcon className="h-2.5 w-2.5 text-brand" />}
      </div>
    </div>
  );
}

export default function BoardCard({ task, onOpen }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: task.id });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={'group relative ' + (isDragging ? 'opacity-30' : '')}
    >
      <div
        onClick={onOpen}
        onKeyDown={(e) => { if (e.key === 'Enter') onOpen?.(); }}
        role="button"
        tabIndex={0}
        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-canvas"
      >
        <BoardCardVisual task={task} />
      </div>
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={'Drag ' + task.title}
        title="Drag to move"
        className="absolute right-1 top-1 cursor-grab rounded p-0.5 text-ink-faint opacity-0 transition-opacity hover:bg-subtle hover:text-ink group-hover:opacity-100 active:cursor-grabbing focus:opacity-100 focus:outline-none"
      >
        <GripVertical className="h-3 w-3" />
      </button>
    </div>
  );
}