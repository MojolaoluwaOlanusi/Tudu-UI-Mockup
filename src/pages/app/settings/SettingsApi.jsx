import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { MOCK_TOKENS } from '@/lib/mockSettings';
import { PageHeader, Section } from './primitives';

function fmtDate(iso) {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SettingsApi() {
  const { pushToast } = useApp();
  const [tokens, setTokens] = useState(MOCK_TOKENS);
  const [label, setLabel] = useState('');
  const [justCreated, setJustCreated] = useState(null);

  const create = () => {
    const t = label.trim();
    if (!t) return;
    const token = {
      id: 'tok-' + Date.now(),
      label: t,
      prefix: 'tudu_pat_' + Math.random().toString(16).slice(2, 10),
      last_used_at: null,
      created_at: new Date().toISOString(),
      plaintext: 'tudu_pat_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
    };
    setTokens((prev) => [token, ...prev]);
    setJustCreated(token);
    setLabel('');
    pushToast('Token created. Copy it now.', 'success');
  };

  const revoke = (id) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
    pushToast('Token revoked.', 'success');
  };

  const copy = (text) => {
    try { navigator.clipboard.writeText(text); pushToast('Copied.', 'success'); }
    catch { pushToast('Could not copy.', 'error'); }
  };

  return (
    <>
      <PageHeader title="API tokens" description="Read-only access to your boards and tasks." />

      {justCreated && (
        <Section title="Copy this token now" description="You will not see it again.">
          <div className="flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 overflow-x-auto rounded-md border border-line bg-canvas px-3 py-2 font-mono text-[12px] text-ink">{justCreated.plaintext}</code>
            <button type="button" onClick={() => copy(justCreated.plaintext)} className="btn-accent !py-1.5 !text-[12px]">Copy</button>
            <button type="button" onClick={() => setJustCreated(null)} className="btn-ghost !py-1.5 !text-[12px]">Done</button>
          </div>
        </Section>
      )}

      <Section title="Create a token">
        <div className="flex flex-wrap items-center gap-2">
          <input type="text" placeholder="Label (e.g. Home Assistant)" value={label} onChange={(e) => setLabel(e.target.value)} className="input min-w-0 flex-1" />
          <button type="button" onClick={create} disabled={!label.trim()} className="btn-accent !py-2 !text-[12px] disabled:opacity-50">
            <Plus className="h-3.5 w-3.5" /> Create
          </button>
        </div>
      </Section>

      <Section title="Your tokens">
        {tokens.length === 0 ? (
          <p className="text-[12px] text-ink-faint">No tokens yet.</p>
        ) : (
          <ul className="space-y-2">
            {tokens.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-line-subtle bg-canvas p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{t.label}</p>
                  <p className="mt-0.5 truncate text-[11px] text-ink-faint">
                    <code className="font-mono">{t.prefix}...</code> - Last used: {fmtDate(t.last_used_at)}
                  </p>
                </div>
                <button type="button" onClick={() => revoke(t.id)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-3 w-3" /> Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Example">
        <pre className="overflow-x-auto rounded-md border border-line bg-canvas p-3 font-mono text-[11px] text-ink-muted">
{`curl -H "Authorization: Bearer <token>" \\
     https://your-tudu-api/api/v1/tasks`}
        </pre>
      </Section>
    </>
  );
}