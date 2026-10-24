import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { MOCK_LICENSES } from '@/lib/mockSettings';
import { PageHeader, Section, Pill } from './primitives';

function fmtDate(iso) {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SettingsLicense() {
  const { pushToast } = useApp();
  const [fingerprint, setFingerprint] = useState('a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2');
  const [note, setNote] = useState('');

  const issue = () => {
    if (fingerprint.trim().length < 16) {
      pushToast('Fingerprint looks too short.', 'error');
      return;
    }
    pushToast('License issued (mock).', 'success');
    setNote('');
  };

  return (
    <>
      <PageHeader title="Self-hosting license" description="Issue a signed license for a self-hosted instance." />

      <Section title="Issue a license">
        <div>
          <label htmlFor="lic-fp" className="label">Server fingerprint</label>
          <input id="lic-fp" type="text" value={fingerprint} onChange={(e) => setFingerprint(e.target.value)} className="input font-mono text-[12px]" />
          <p className="mt-1 text-[11px] text-ink-faint">Paste the 64-character fingerprint from the self-hosted server.</p>
        </div>
        <div>
          <label htmlFor="lic-note" className="label">Note (optional)</label>
          <input id="lic-note" type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Production server, eu-west-1" className="input" />
        </div>
        <button type="button" onClick={issue} className="btn-accent !py-1.5 !text-[12px]">Generate license</button>
      </Section>

      <Section title="Your licenses">
        <ul className="space-y-2">
          {MOCK_LICENSES.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-line-subtle bg-canvas p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] text-ink">{l.fingerprint.slice(0, 16)}...</p>
                <p className="mt-0.5 truncate text-[11px] text-ink-faint">Issued {fmtDate(l.issued_at)} - expires {fmtDate(l.expires_at)}{l.notes ? ' - ' + l.notes : ''}</p>
              </div>
              <Pill tone="brand">{l.tier}</Pill>
              <button type="button" onClick={() => pushToast('Download license (mock).', 'info')} className="rounded-md border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink hover:border-line-strong">Download</button>
              <button type="button" onClick={() => pushToast('License revoked (mock).', 'info')} className="rounded-md px-2 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/10">Revoke</button>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}