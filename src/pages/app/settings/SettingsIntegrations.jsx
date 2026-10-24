import { useState } from 'react';
import { Github, Hash } from 'lucide-react';
import { MOCK_INTEGRATIONS } from '@/lib/mockSettings';
import { useApp } from '@/store/AppContext';
import { PageHeader, Section, Pill } from './primitives';

export default function SettingsIntegrations() {
  const { pushToast } = useApp();
  const [gh] = useState(MOCK_INTEGRATIONS.github);
  const [slack] = useState(MOCK_INTEGRATIONS.slack);

  return (
    <>
      <PageHeader title="Integrations" description="Connect Tudu to the tools you already use." />

      <Section title="GitHub">
        <div className="flex items-center gap-3 rounded-lg border border-line-subtle bg-canvas p-4">
          <Github className="h-5 w-5 text-ink-muted" />
          <div className="min-w-0 flex-1">
            {gh.connected ? (
              <>
                <p className="text-sm text-ink">Connected as <span className="font-semibold">@{gh.login}</span></p>
                <p className="mt-0.5 text-[11px] text-ink-faint">PRs with TUDU-N in the title move cards automatically.</p>
              </>
            ) : (
              <p className="text-sm text-ink-muted">Connect GitHub to auto-move cards from pull requests.</p>
            )}
          </div>
          {gh.connected ? (
            <button type="button" onClick={() => pushToast('Disconnect GitHub (mock).', 'info')} className="btn-ghost !py-1.5 !text-[12px]">Disconnect</button>
          ) : (
            <button type="button" onClick={() => pushToast('Connect GitHub (mock).', 'info')} className="btn-accent !py-1.5 !text-[12px]">Connect</button>
          )}
        </div>
      </Section>

      <Section title="Slack">
        <div className="flex items-center gap-3 rounded-lg border border-line-subtle bg-canvas p-4">
          <Hash className="h-5 w-5 text-ink-muted" />
          <div className="min-w-0 flex-1">
            {slack.connected ? (
              <>
                <p className="text-sm text-ink">Connected to <span className="font-semibold">{slack.teamName}</span></p>
                <p className="mt-0.5 text-[11px] text-ink-faint">Notifications appear in #{slack.channelName}.</p>
              </>
            ) : (
              <p className="text-sm text-ink-muted">Connect Slack for assignment alerts and a /tudu slash command.</p>
            )}
          </div>
          {slack.connected ? (
            <button type="button" onClick={() => pushToast('Disconnect Slack (mock).', 'info')} className="btn-ghost !py-1.5 !text-[12px]">Disconnect</button>
          ) : (
            <button type="button" onClick={() => pushToast('Connect Slack (mock).', 'info')} className="btn-accent !py-1.5 !text-[12px]">Connect</button>
          )}
        </div>
      </Section>

      <Section title="Coming soon" description="We're building more integrations.">
        <div className="flex flex-wrap gap-2">
          {['Linear', 'Notion', 'Figma', 'Discord'].map((name) => (
            <span key={name} className="inline-flex items-center gap-1 rounded-md border border-line bg-canvas px-2.5 py-1 text-[12px] text-ink-muted">
              {name}
              <Pill tone="brand">Soon</Pill>
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}