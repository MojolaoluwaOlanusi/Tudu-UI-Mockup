import { useState } from 'react';
import { Pencil, Trash2, ChevronRight, Clock, Timer as TimerIcon } from 'lucide-react';
import { useApp } from '@/store/AppContext';

const CATEGORY_COLORS = {
  work: 'bg-blue-500/10 text-blue-400',
  personal: 'bg-purple-500/10 text-purple-400',
  study: 'bg-emerald-500/10 text-emerald-400',
};

const PRIORITY_COLORS = {
  low: 'bg-line-subtle text-ink-muted',
  medium: 'bg-amber-500/10 text-amber-400',
  high: 'bg-red-500/10 text-red-400',
};

const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

function CheckPop() {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-subtle" style={{ width: 20, height: 20 }}>
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
        <path d="M5 13l4 4L19 7" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-pop" />
      </svg>
    </span>
  );
}

function isOverdue(task) {
  if (!task.due_date || task.status === 'done') return false;
  return new Date(task.due_date).getTime() < Date.now();
}

function formatDue(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const { updateTask, startPomodoro, startTimer } = useApp();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [subtaskDraft, setSubtaskDraft] = useState('');

  const subtasks = task.subtasks || [];
  const subtaskTotal = subtasks.length;
  const subtaskDone = subtasks.filter((s) => s.completed).length;
  const subtaskPercent = subtaskTotal === 0 ? 0 : Math.round((subtaskDone / subtaskTotal) * 100);
  const overdue = isOverdue(task);
  const done = task.status === 'done';

  const copyId = () => {
    try { navigator.clipboard.writeText('TUDU-' + task.short_id); } catch {}
  };

  const addSubtask = () => {
    const t = subtaskDraft.trim();
    if (!t) return;
    updateTask(task.id, { subtasks: [...subtasks, { id: 'st-' + Date.now(), title: t, completed: false }] });
    setSubtaskDraft('');
  };

  const toggleSubtask = (id) => {
    updateTask(task.id, {
      subtasks: subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    });
  };

  const removeSubtask = (id) => {
    updateTask(task.id, { subtasks: subtasks.filter((s) => s.id !== id) });
  };

  return (
    <div className="card p-4" data-tour="task-card">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {task.short_id && (
            <button
              type="button"
              onClick={copyId}
              title="Copy Task ID"
              className="self-start rounded bg-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-muted transition-colors hover:text-ink"
            >
              TUDU-{task.short_id}
            </button>
          )}
          <div className="flex min-w-0 items-start gap-2">
            {done && <span className="mt-0.5"><CheckPop /></span>}
            <h3
              className={
                'min-w-0 flex-1 text-base font-semibold transition-colors ' +
                (done ? 'text-ink-muted line-through' : 'text-ink')
              }
            >
              {task.title}
            </h3>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(task)}
              title="Edit"
              aria-label="Edit task"
              className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-subtle hover:text-brand"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(task)}
              title="Delete"
              aria-label="Delete task"
              className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="mb-3 text-sm leading-relaxed text-ink-muted">{task.description}</p>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        {task.category && (
          <span className={'rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ' + (CATEGORY_COLORS[task.category] || 'bg-line-subtle text-ink-muted')}>
            {task.category}
          </span>
        )}
        {task.priority && (
          <span className={'rounded-full px-2 py-0.5 text-[11px] font-medium ' + (PRIORITY_COLORS[task.priority] || 'bg-line-subtle text-ink-muted')}>
            {PRIORITY_LABEL[task.priority] || task.priority}
          </span>
        )}
        {task.due_date && (
          <span className={'rounded-full px-2 py-0.5 text-[11px] font-medium ' + (overdue ? 'bg-red-500/10 text-red-400' : 'bg-line-subtle text-ink-muted')}>
            {overdue ? 'Overdue: ' : ''}{formatDue(task.due_date)}
          </span>
        )}
      </div>

      <div className="mb-3 border-t border-line-subtle pt-3">
        <button
          type="button"
          onClick={() => setShowSubtasks((v) => !v)}
          aria-expanded={showSubtasks}
          className="flex w-full items-center gap-2 text-left"
        >
          <ChevronRight className={'h-3.5 w-3.5 shrink-0 text-ink-muted transition-transform ' + (showSubtasks ? 'rotate-90' : '')} />
          <span className="text-xs font-semibold text-ink">Sub-tasks</span>
          {subtaskTotal > 0 ? (
            <>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-subtle">
                <span className="block h-full rounded-full bg-brand transition-all" style={{ width: subtaskPercent + '%' }} />
              </span>
              <span className="shrink-0 text-[11px] font-medium text-ink-muted tabular-nums">
                {subtaskDone}/{subtaskTotal}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-ink-muted">Add steps</span>
          )}
        </button>

        {showSubtasks && (
          <div className="mt-2 pl-5">
            {subtasks.length > 0 && (
              <ul className="mb-2 space-y-1">
                {subtasks.map((s) => (
                  <li key={s.id} className="group flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={s.completed}
                      onChange={() => toggleSubtask(s.id)}
                      aria-label={s.title}
                      className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-brand"
                    />
                    <span className={'min-w-0 flex-1 text-xs ' + (s.completed ? 'text-ink-muted line-through' : 'text-ink')}>
                      {s.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(s.id)}
                      aria-label={'Remove ' + s.title}
                      className="shrink-0 rounded p-0.5 text-ink-faint opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <form
              onSubmit={(e) => { e.preventDefault(); addSubtask(); }}
              className="flex items-center gap-1"
            >
              <input
                type="text"
                value={subtaskDraft}
                onChange={(e) => setSubtaskDraft(e.target.value)}
                placeholder="Add a sub-task"
                className="min-w-0 flex-1 rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                disabled={!subtaskDraft.trim()}
                className="shrink-0 rounded-md bg-brand px-2 py-1 text-[11px] font-semibold text-ink-inverse transition-opacity disabled:opacity-40"
              >
                Add
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => startPomodoro(task.title)}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand"
        >
          <TimerIcon className="h-3 w-3" />
          Start 25m
        </button>
        <button
          type="button"
          onClick={() => startTimer(task.title)}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted transition-colors hover:border-doing hover:text-doing"
        >
          <Clock className="h-3 w-3" />
          Start timer
        </button>
      </div>

      <div className="mb-3">
        <button
          type="button"
          onClick={() => setShowActivity((v) => !v)}
          aria-expanded={showActivity}
          className="flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-brand"
        >
          <ChevronRight className={'h-3 w-3 transition-transform ' + (showActivity ? 'rotate-90' : '')} />
          Activity
        </button>
        {showActivity && (
          <div className="mt-2 rounded-lg bg-raised p-2.5">
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-[11px] text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
                <span className="flex-1 truncate">created this task</span>
                <span className="shrink-0 text-ink-faint">2h ago</span>
              </li>
              {task.status === 'doing' && (
                <li className="flex items-center gap-2 text-[11px] text-ink-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-doing" />
                  <span className="flex-1 truncate">moved to Doing</span>
                  <span className="shrink-0 text-ink-faint">1h ago</span>
                </li>
              )}
              {task.status === 'done' && (
                <li className="flex items-center gap-2 text-[11px] text-ink-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span className="flex-1 truncate">completed</span>
                  <span className="shrink-0 text-ink-faint">30m ago</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => updateTask(task.id, { status: e.target.value })}
          aria-label="Change task status"
          className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
        >
          <option value="todo">To-do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}