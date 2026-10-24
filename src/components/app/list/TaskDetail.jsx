import { useState } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';
import { useApp } from '@/store/AppContext';

const PRIORITY_STYLE = {
  high: 'bg-red-500/15 text-red-400',
  medium: 'bg-amber-500/15 text-amber-400',
  low: 'bg-line-subtle text-ink-muted',
};

function formatDue(iso) {
  if (!iso) return 'None';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toDateTimeLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    '-' + pad(d.getMonth() + 1) +
    '-' + pad(d.getDate()) +
    'T' + pad(d.getHours()) +
    ':' + pad(d.getMinutes())
  );
}

function activityFor(task) {
  const items = [];
  items.push({ id: 'a1', text: 'created this task', when: '2h ago', dot: 'bg-ink-faint' });
  if (task.status === 'doing' || task.status === 'done') {
    items.push({ id: 'a2', text: 'moved to Doing', when: '1h ago', dot: 'bg-doing' });
  }
  if (task.status === 'done') {
    items.push({ id: 'a3', text: 'completed this task', when: '30m ago', dot: 'bg-brand' });
  }
  if (task.timerRunning) {
    items.push({ id: 'a4', text: 'started a Pomodoro', when: '5m ago', dot: 'bg-brand' });
  }
  return items;
}

export default function TaskDetail({ task, onClose }) {
  const { updateTask, deleteTask } = useApp();
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [editingTitle, setEditingTitle] = useState(false);
  const [subtaskDraft, setSubtaskDraft] = useState('');

  const subtasks = task.subtasks || [];
  const total = subtasks.length;
  const done = subtasks.filter((s) => s.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const activity = activityFor(task);

  const saveTitle = () => {
    const t = titleDraft.trim();
    if (!t) {
      setTitleDraft(task.title);
      setEditingTitle(false);
      return;
    }
    updateTask(task.id, { title: t });
    setEditingTitle(false);
  };

  const cycleStatus = () => {
    const next =
      task.status === 'todo' ? 'doing' : task.status === 'doing' ? 'done' : 'todo';
    updateTask(task.id, { status: next });
  };

  const addSubtask = () => {
    const t = subtaskDraft.trim();
    if (!t) return;
    const newSubtask = { id: 'st-' + Date.now(), title: t, completed: false };
    updateTask(task.id, { subtasks: [...subtasks, newSubtask] });
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
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-line-subtle px-4">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Task detail
          </p>
        </div>
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
        <div className="p-4">
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={cycleStatus}
              aria-label="Cycle status"
              className={
                'mt-1.5 h-4 w-4 shrink-0 rounded-full border transition-colors ' +
                (task.status === 'done'
                  ? 'border-brand bg-brand'
                  : task.status === 'doing'
                    ? 'border-doing bg-doing'
                    : 'border-line-strong')
              }
            />
            {editingTitle ? (
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveTitle();
                  if (e.key === 'Escape') {
                    setTitleDraft(task.title);
                    setEditingTitle(false);
                  }
                }}
                className="min-w-0 flex-1 rounded-md border border-line bg-surface px-2 py-1 text-[15px] font-semibold text-ink focus:border-brand focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingTitle(true)}
                className={
                  'min-w-0 flex-1 text-left text-[15px] font-semibold ' +
                  (task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink')
                }
              >
                {task.title}
              </button>
            )}
            {task.priority && (
              <span
                className={
                  'shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ' +
                  PRIORITY_STYLE[task.priority]
                }
              >
                {task.priority}
              </span>
            )}
          </div>

          <div className="mt-4">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Description
            </p>
            <textarea
              value={task.description || ''}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              rows={3}
              placeholder="Add a description..."
              className="w-full resize-none rounded-md border border-line bg-surface px-2.5 py-2 text-[12px] text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
            />
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Subtasks
              </p>
              <span className="text-[11px] text-ink-faint tabular-nums">
                {done}/{total}
              </span>
            </div>
            {total > 0 && (
              <div className="mb-2 h-1 overflow-hidden rounded-full bg-line-subtle">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: percent + '%' }} />
              </div>
            )}
            <ul className="space-y-1">
              {subtasks.map((s) => (
                <li key={s.id} className="group flex items-center gap-2 rounded-md px-1 py-1 hover:bg-subtle/40">
                  <input
                    type="checkbox"
                    checked={s.completed}
                    onChange={() => toggleSubtask(s.id)}
                    className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-brand"
                  />
                  <span
                    className={
                      'min-w-0 flex-1 truncate text-[12px] ' +
                      (s.completed ? 'text-ink-faint line-through' : 'text-ink')
                    }
                  >
                    {s.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(s.id)}
                    aria-label="Remove subtask"
                    className="shrink-0 rounded p-0.5 text-ink-faint opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
              <input
                type="text"
                value={subtaskDraft}
                onChange={(e) => setSubtaskDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addSubtask();
                }}
                placeholder="Add a subtask"
                className="min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-ink-faint focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Activity
            </p>
            <ul className="space-y-1.5">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center gap-2 text-[11px] text-ink-muted">
                  <span className={'h-1.5 w-1.5 shrink-0 rounded-full ' + a.dot} />
                  <span className="min-w-0 flex-1 truncate">{a.text}</span>
                  <span className="shrink-0 text-ink-faint">{a.when}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 space-y-1.5 border-t border-line-subtle pt-3">
            <FieldRow label="Status">
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value })}
                className="rounded bg-surface text-[12px] text-ink focus:outline-none"
              >
                <option value="todo">To-do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </FieldRow>
            <FieldRow label="Category">
              <select
                value={task.category || ''}
                onChange={(e) => updateTask(task.id, { category: e.target.value || null })}
                className="rounded bg-surface text-[12px] text-ink focus:outline-none"
              >
                <option value="">None</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
              </select>
            </FieldRow>
            <FieldRow label="Priority">
              <select
                value={task.priority || ''}
                onChange={(e) => updateTask(task.id, { priority: e.target.value || null })}
                className="rounded bg-surface text-[12px] text-ink focus:outline-none"
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </FieldRow>
            <FieldRow label="Due">
              <input
                type="datetime-local"
                value={toDateTimeLocal(task.due_date)}
                onChange={(e) => {
                  const v = e.target.value;
                  updateTask(task.id, { due_date: v ? new Date(v).toISOString() : null });
                }}
                className="rounded bg-surface text-[12px] text-ink focus:outline-none"
              />
            </FieldRow>
            <FieldRow label="Assignee">
              <span className="text-[12px] text-ink">
                {task.assignee ? task.assignee.name : 'Unassigned'}
              </span>
            </FieldRow>
            <FieldRow label="Board">
              <span className="text-[12px] text-ink">My board</span>
            </FieldRow>
          </div>

          <div className="mt-5 border-t border-line-subtle pt-3">
            <button
              type="button"
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-red-400 transition-colors hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-ink-faint">{label}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}