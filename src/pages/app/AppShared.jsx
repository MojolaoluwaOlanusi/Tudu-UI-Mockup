import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { SHARED_WITH_ME } from '@/lib/mockData';
import TaskCard from '@/components/app/list/TaskCard';

export default function AppShared() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, openDetail, deleteTask } = useApp();
  const shared = SHARED_WITH_ME.find((s) => s.id === id);
  const sharedTasks = useMemo(() => tasks.filter((t) => !t.deleted).slice(0, 3), [tasks]);

  if (!shared) {
    return (
      <div className="p-6 md:p-8">
        <button type="button" onClick={() => navigate('/app')} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          Back to all shared lists
        </button>
        <h1 className="font-handwritten text-3xl text-ink">List not found</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 md:p-6">
        <button type="button" onClick={() => navigate('/app')} className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-muted transition-colors hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all shared lists
        </button>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-[14px] font-semibold text-ink-inverse">{shared.initials}</span>
          <div className="min-w-0">
            <h1 className="font-handwritten text-3xl leading-none text-ink">{shared.owner}'s list</h1>
            <p className="mt-1.5 text-[12px] text-ink-faint">Shared with you - {shared.completedCount}/{shared.taskCount} done</p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-6 md:px-6">
        <div className="space-y-3">
          {sharedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={() => openDetail({ type: 'task', id: task.id })} onDelete={() => deleteTask(task.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}