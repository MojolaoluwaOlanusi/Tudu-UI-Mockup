import { useState } from 'react';
import { MoreHorizontal, Timer as TimerIcon, AlertCircle } from 'lucide-react';

const PRIORITY_STYLE = {
  high: 'bg-red-500/15 text-red-400',
  medium: 'bg-amber-500/15 text-amber-400',
  low: 'bg-line-subtle text-ink-muted',
};

const PRIORITY_LETTER = { high: 'H', medium: 'M', low: 'L' };

const STATUS_STRIPE = {
  todo: 'bg-todo',
  doing: 'bg-doing',
  done: 'bg-done',
};

const STATUS_DOT = {
  todo: 'border-line-strong',
  doing: 'border-doing bg-doing',
  done: 'border-brand bg-brand',
};

function isOverdue(task) {
  if (!task.due_date || task.status === 'done') return false;
  return new Date(task.due_date).getTime() < Date.now();
}

function formatDue(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function ListRow({
  task,
  isSelectMode,
  selected,
  onToggleSelect,
  onOpen,
  onCycleStatus,
}) {
  const [hovered, setHovered] = useState(false);

  const subtaskTotal = (task.subtasks || []).length;
  const subtaskDone = (task.subtasks || []).filter((s) => s.completed).length;
  const subtaskPercent = subtaskTotal === 0 ? 0 : Math.round((subtaskDone / subtaskTotal) * 100);
  const overdue = isOverdue(task);

  const onRowClick = (e) => {
    if (isSelectMode) {
      e.preventDefault();
      onToggleSelect();
      return;
    }
    onOpen();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={
        'group relative flex items-start gap-2 border-b border-line-subtle px-3 py-2.5 transition-colors ' +
        (selected ? 'bg-brand-subtle/40' : 'hover:bg-subtle/40')
      }
    >
      <span
        aria-hidden="true"
        className={
          'absolute left-0 top-0 h-full w-0.5 ' +
          (task.status === 'done' ? STATUS_STRIPE.done : task.status === 'doing' ? STATUS_STRIPE.doing : 'bg-transparent')
        }
      />

      {isSelectMode ? (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          aria-label={'Select ' + task.title}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-line-strong accent-brand"
        />
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCycleStatus();
          }}
          aria-label={'Cycle status of ' + task.title}
          className={
            'mt-1 h-4 w-4 shrink-0 rounded-full border ' + STATUS_DOT[task.status] + ' transition-colors'
          }
        />
      )}

      <button
        type="button"
        onClick={onRowClick}
        className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left"
      >
        <div className="flex w-full min-w-0 items-center gap-2">
          <span
            className={
              'min-w-0 flex-1 truncate text-[13px] font-medium ' +
              (task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink')
            }
          >
            {task.title}
          </span>
          {task.priority && (
            <span
              className={
                'shrink-0 rounded-sm px-1 text-[10px] font-semibold ' +
                PRIORITY_STYLE[task.priority]
              }
              title={task.priority + ' priority'}
            >
              {PRIORITY_LETTER[task.priority]}
            </span>
          )}
          {task.timerRunning && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-ink-muted" title="Pomodoro running">
              <TimerIcon className="h-3 w-3" />
            </span>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink-faint">
          {task.category && <span>#{task.category}</span>}
          {task.due_date && (
            <span className={overdue ? 'inline-flex items-center gap-0.5 text-red-400' : ''}>
              {overdue && <AlertCircle className="h-3 w-3" />}
              {overdue ? 'Overdue ' : ''}
              {formatDue(task.due_date)}
            </span>
          )}
          {subtaskTotal > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-10 overflow-hidden rounded-full bg-line-subtle">
                <span
                  className="block h-full rounded-full bg-brand"
                  style={{ width: subtaskPercent + '%' }}
                />
              </span>
              <span className="tabular-nums">
                {subtaskDone}/{subtaskTotal}
              </span>
            </span>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        aria-label={'Task actions for ' + task.title}
        className={
          'shrink-0 rounded-md p-1 text-ink-muted transition-opacity hover:bg-subtle hover:text-ink ' +
          (hovered ? 'opacity-100' : 'opacity-0')
        }
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}