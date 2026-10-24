import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SHARED_WITH_ME } from '@/lib/mockData';

export default function AppShared() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shared = SHARED_WITH_ME.find((s) => s.id === id);

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
      <h1 className="text-2xl font-semibold text-ink">
        {shared ? shared.owner + "'s list" : 'Shared list'}
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
        Shared list content lands in Part 10 alongside the task rows. This page
        proves the sidebar navigation and back button work.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-line bg-surface/50 p-6 text-center">
        <p className="text-xs text-ink-faint">Shared list - Part 10</p>
      </div>
    </div>
  );
}