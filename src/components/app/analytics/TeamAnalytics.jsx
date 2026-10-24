import { useState } from 'react';
import { Lock } from 'lucide-react';
import { TEAM_MOCK } from '@/lib/mockAnalytics';
import { LineChart, BarChart } from '@/components/app/charts/Charts';

function useMockTier() {
  const [tier] = useState(() => {
    try {
      return localStorage.getItem('tudu-mock-tier') || 'free';
    } catch {
      return 'free';
    }
  });
  return tier;
}

function UpgradeCard() {
  return (
    <div className="card border-accent/30 bg-brand-subtle/10 p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand">
          <Lock className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Team analytics is a Pro feature</p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
            Per-member completion rates, burndown charts, and board-by-board breakdowns.
            Upgrade to unlock.
          </p>
          <a
            href="#/pricing"
            className="mt-3 inline-flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-[12px] font-semibold text-ink-inverse transition-colors hover:bg-brand-hover"
          >
            See plans
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TeamAnalytics() {
  const tier = useMockTier();
  if (tier !== 'pro') return <UpgradeCard />;

  const data = TEAM_MOCK;
  const burndownData = data.burndown.map((v, i) => ({ label: 'D' + (i + 1), value: v }));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Total</p>
          <p className="mt-1 font-handwritten text-3xl leading-none text-ink">{data.overview.tasks.total}</p>
          <p className="mt-1 text-[11px] text-ink-faint">{data.overview.completionRate}% done</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Done</p>
          <p className="mt-1 font-handwritten text-3xl leading-none text-ink">{data.overview.tasks.done}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Doing</p>
          <p className="mt-1 font-handwritten text-3xl leading-none text-ink">{data.overview.tasks.doing}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Overdue</p>
          <p className={'mt-1 font-handwritten text-3xl leading-none ' + (data.overview.tasks.overdue > 0 ? 'text-red-400' : 'text-ink')}>
            {data.overview.tasks.overdue}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Members</p>
          <p className="mt-1 font-handwritten text-3xl leading-none text-ink">{data.byMember.length}</p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-handwritten text-xl text-ink">Burndown</h2>
        <p className="mb-3 text-[11px] text-ink-faint">Remaining tasks, end of each day</p>
        <LineChart data={burndownData} height={140} />
      </div>

      <div className="card p-5">
        <h2 className="mb-3 font-handwritten text-xl text-ink">By member</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="text-[10px] uppercase tracking-wider text-ink-faint">
              <tr>
                <th className="pb-2 text-left">Member</th>
                <th className="pb-2 text-left">Role</th>
                <th className="pb-2 text-right">Done</th>
                <th className="pb-2 text-right">Doing</th>
                <th className="pb-2 text-right">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {data.byMember.map((m) => (
                <tr key={m.email} className="border-t border-line-subtle">
                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-ink-inverse">
                        {m.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-ink">{m.name}</p>
                        <p className="truncate text-[10px] text-ink-faint">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 pr-2 capitalize text-ink-muted">{m.role}</td>
                  <td className="py-2 pr-2 text-right text-ink tabular-nums">{m.completed}</td>
                  <td className="py-2 pr-2 text-right text-ink-muted tabular-nums">{m.inProgress}</td>
                  <td className="py-2 pr-2 text-right text-ink-muted tabular-nums">{m.assigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-3 font-handwritten text-xl text-ink">By board</h2>
        <ul className="space-y-2">
          {data.boards.map((b) => {
            const pct = b.total === 0 ? 0 : Math.round((b.done / b.total) * 100);
            return (
              <li key={b.name} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-[12px] text-ink">{b.name}</span>
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-line-subtle">
                  <span className="block h-full rounded-full bg-brand" style={{ width: pct + '%' }} />
                </span>
                <span className="w-16 shrink-0 text-right text-[11px] text-ink-muted tabular-nums">
                  {b.done}/{b.total}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}