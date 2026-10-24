import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { MOCK_WORKSPACE_MEMBERS } from '@/lib/mockSettings';
import { PageHeader, Section, Avatar, Pill } from './primitives';

export default function SettingsWorkspace() {
  const { pushToast } = useApp();
  const [members, setMembers] = useState(MOCK_WORKSPACE_MEMBERS);
  const [email, setEmail] = useState('');

  const invite = () => {
    const t = email.trim().toLowerCase();
    if (!t || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t)) {
      pushToast('A valid email is required.', 'error');
      return;
    }
    setMembers((prev) => [...prev, { id: 'u-' + Date.now(), name: t.split('@')[0], email: t, role: 'member', status: 'pending' }]);
    setEmail('');
    pushToast('Invitation sent.', 'success');
  };

  const remove = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    pushToast('Member removed.', 'success');
  };

  return (
    <>
      <PageHeader title="Team A" description="Manage members and roles for this workspace." />

      <Section title="Members" description={members.length + ' member' + (members.length === 1 ? '' : 's')}>
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-lg border border-line-subtle bg-canvas p-3">
              <Avatar name={m.name} size={10} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{m.name}</p>
                <p className="truncate text-[11px] text-ink-faint">{m.email}</p>
              </div>
              <Pill tone={m.role === 'admin' ? 'brand' : 'default'}>{m.role}</Pill>
              {m.status === 'pending' && <Pill tone="warn">Pending</Pill>}
              <button type="button" onClick={() => remove(m.id)} className="rounded-md px-2 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/10">Remove</button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Invite a member">
        <div className="flex flex-wrap items-center gap-2">
          <input type="email" placeholder="teammate@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input min-w-0 flex-1" />
          <button type="button" onClick={invite} className="btn-accent !py-2 !text-[12px]">Invite</button>
        </div>
        <p className="text-[11px] text-ink-faint">They need a Tudu account already. The invitation appears in their app.</p>
      </Section>
    </>
  );
}