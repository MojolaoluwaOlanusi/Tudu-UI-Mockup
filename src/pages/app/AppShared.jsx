import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import { groupTasks } from '@/lib/mockTasks';
import { SHARED_WITH_ME } from '@/lib/mockData';
import ListRow from '@/components/app/list/ListRow';

export default function AppShared() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, openDetail, updateTask } = useApp();
  const [groupBy] = useState('status');
  const shared = SHARED_WITH_ME.find((s) => s.id === id);

  const sharedTasks = useMemo(
    () => tasks.filter((t) => !t.deleted).slice(0, 3),
    [tasks]
  );
  const groups = useMemo(() => groupTasks(sharedTasks, groupBy), [sharedTasks, groupBy]);

  if (!shared) {
    return (
      <div className="p-6 md:p-8">
        <button
          type="button"
          onClick={() => navigate('/app')}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all shared lists
        </button>
        <h1 className="text-2xl font-semibold text-ink">Shared list not found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          This list may have been removed by its owner.
        </p>
      </div>
    );
  }

  const cycleStatus = (taskId) => {
    const task = sharedTasks.find((t) => t.id === taskId);
    if (!task) return;
    const next =
      task.status === 'todo' ? 'doing' : task.status === 'doing' ? 'done' : 'todo';
    updateTask(taskId, { status: next });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line-subtle px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('/app')}
          className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all shared lists
        </button>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-ink-inverse">
            {shared.initials}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-ink">
              {shared.owner}'s list
            </h1>
            <p className="mt-0.5 text-[11px] text-ink-faint">
              Shared with you - {shared.completedCount}/{shared.taskCount} done
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {groups.map((g) => (
          <div key={g.key}>
            <div className="flex h-9 items-center gap-1.5 border-b border-line-subtle px-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                {g.label}
              </span>
              <span className="text-[11px] font-medium text-ink-faint tabular-nums">
                {g.tasks.length}
              </span>
            </div>
            {g.tasks.map((task) => (
              <ListRow
                key={task.id}
                task={task}
                isSelectMode={false}
                selected={false}
                onToggleSelect={() => {}}
                onOpen={() => openDetail({ type: 'task', id: task.id })}
                onCycleStatus={() => cycleStatus(task.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}