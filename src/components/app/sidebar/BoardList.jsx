import { useNavigate, useLocation } from 'react-router-dom';
import { User, Users } from 'lucide-react';
import { BOARDS, WORKSPACES } from '@/lib/mockData';

export default function BoardList({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const personal = BOARDS.filter((b) => b.workspace_id === null);
  const groups = [
    { id: 'personal', name: 'Personal', icon: User, boards: personal },
  ];
  for (const ws of WORKSPACES) {
    const boards = BOARDS.filter((b) => b.workspace_id === ws.id);
    if (boards.length > 0) {
      groups.push({ id: ws.id, name: ws.name, icon: Users, boards });
    }
  }

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1 px-2 py-2">
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              type="button"
              title={g.name}
              aria-label={g.name}
              onClick={() => navigate('/app')}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3 px-2 pb-2 pt-1">
      {groups.map((g) => {
        const Icon = g.icon;
        return (
          <div key={g.id}>
            <div className="flex items-center gap-1.5 px-2 py-1">
              <Icon className="h-3 w-3 shrink-0 text-ink-faint" />
              <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                {g.name}
              </span>
            </div>
            <ul>
              {g.boards.map((b) => {
                const active = location.pathname === '/app' && b.id === 'b-1';
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => navigate('/app')}
                      className={
                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ' +
                        (active
                          ? 'bg-brand-subtle font-medium text-brand'
                          : 'text-ink-muted hover:bg-subtle hover:text-ink')
                      }
                    >
                      <span
                        className={
                          'h-1.5 w-1.5 shrink-0 rounded-full ' +
                          (active ? 'bg-brand' : 'bg-ink-faint')
                        }
                      />
                      <span className="truncate">{b.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}