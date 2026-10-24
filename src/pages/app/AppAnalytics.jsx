import { useState } from 'react';
import PersonalAnalytics from '@/components/app/analytics/PersonalAnalytics';
import TeamAnalytics from '@/components/app/analytics/TeamAnalytics';

export default function AppAnalytics() {
  const [tab, setTab] = useState('personal');
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-handwritten text-3xl leading-none text-ink sm:text-4xl">Analytics</h1>
          <p className="mt-2 text-[12px] text-ink-faint">
            Personal and team insights.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-line bg-surface p-1">
          <button
            type="button"
            onClick={() => setTab('personal')}
            className={
              'rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ' +
              (tab === 'personal' ? 'bg-raised text-ink' : 'text-ink-muted hover:text-ink')
            }
          >
            Personal
          </button>
          <button
            type="button"
            onClick={() => setTab('team')}
            className={
              'rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ' +
              (tab === 'team' ? 'bg-raised text-ink' : 'text-ink-muted hover:text-ink')
            }
          >
            Team
          </button>
        </div>
      </div>

      {tab === 'personal' ? <PersonalAnalytics /> : <TeamAnalytics />}
    </div>
  );
}