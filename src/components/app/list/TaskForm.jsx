import { useState } from 'react';
import { X, Calendar, Tag, Zap } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { parseTaskText } from '@/lib/mockTasks';

function toDateTimeLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function chipStyle(item) {
  if (item.type === 'date') return 'border-sky-500/30 bg-sky-500/10 text-sky-400';
  if (item.type === 'category') {
    if (item.value === 'work') return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
    if (item.value === 'personal') return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
    if (item.value === 'study') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  }
  if (item.type === 'priority') {
    if (item.value === 'high') return 'border-red-500/30 bg-red-500/10 text-red-400';
    if (item.value === 'medium') return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
    if (item.value === 'low') return 'border-line bg-line-subtle text-ink-muted';
  }
  return 'border-line bg-line-subtle text-ink-muted';
}

function chipIcon(item) {
  if (item.type === 'date') return Calendar;
  if (item.type === 'category') return Tag;
  if (item.type === 'priority') return Zap;
  return Tag;
}

export default function TaskForm({ onClose }) {
  const { createTask, composerColumnId } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [preview, setPreview] = useState(null);

  const onTitleChange = (value) => {
    setTitle(value);
    if (!value.trim()) { setPreview(null); return; }
    setPreview(parseTaskText(value));
  };

  const applyPreview = () => {
    if (!preview) return;
    setTitle(preview.title);
    if (preview.category) setCategory(preview.category);
    if (preview.priority) setPriority(preview.priority);
    if (preview.due_date) setDueDate(toDateTimeLocal(preview.due_date));
    setPreview(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask({
      title: title.trim(),
      description: description.trim() || null,
      category: category || null,
      priority: priority || null,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      column_id: composerColumnId || null,
    });
    onClose();
  };

  const items = preview && preview.matchedItems ? preview.matchedItems : [];
  const hasPreview = items.length > 0;

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-handwritten text-3xl text-ink">New task</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="tf-title">Title</label>
          <input
            id="tf-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Buy milk tomorrow at 9am #personal urgent"
            className="input"
            autoFocus
          />
          {hasPreview && (
            <div className="mt-2 rounded-lg border border-line-subtle bg-raised p-2.5">
              <div className="flex flex-wrap gap-1.5">
                {items.map((item, i) => {
                  const Icon = chipIcon(item);
                  return (
                    <span
                      key={i}
                      className={'inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ' + chipStyle(item)}
                    >
                      <Icon className="h-2.5 w-2.5 shrink-0" />
                      {item.label}
                    </span>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="truncate text-[11px] text-ink-muted">
                  Title becomes <span className="font-medium text-ink">{preview.title}</span>
                </p>
                <button
                  type="button"
                  onClick={applyPreview}
                  className="shrink-0 rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  Use these
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="label" htmlFor="tf-desc">Description</label>
          <textarea
            id="tf-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add a few details"
            className="input resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="tf-cat">Category</label>
            <select id="tf-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              <option value="">None</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="study">Study</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="tf-prio">Priority</label>
            <select id="tf-prio" value={priority} onChange={(e) => setPriority(e.target.value)} className="input">
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="tf-due">Due</label>
            <input
              id="tf-due"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={!title.trim()} className="btn-accent">Create task</button>
        </div>
      </form>
    </div>
  );
}