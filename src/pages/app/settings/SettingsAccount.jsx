import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader, Section, Field, Avatar } from './primitives';

export default function SettingsAccount() {
  const { pushToast } = useApp();
  const [name, setName] = useState('Mojola Olanusi');
  const [email] = useState('mojola@tudu.app');

  const save = () => pushToast('Account updated.', 'success');

  return (
    <>
      <PageHeader title="Account" description="Your profile and login details." />

      <Section title="Profile">
        <Field label="Name" id="acc-name">
          <input id="acc-name" type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} onBlur={save} />
        </Field>
        <Field label="Email" id="acc-email" hint="Contact support to change your email.">
          <input id="acc-email" type="email" className="input" value={email} disabled />
        </Field>
        <Field label="Avatar">
          <div className="flex items-center gap-3">
            <Avatar name={name} size={12} />
            <button type="button" onClick={save} className="btn-ghost !py-1.5 !text-[12px]">Change</button>
          </div>
        </Field>
      </Section>

      <Section title="Danger zone">
        <button type="button" className="text-[12px] font-medium text-red-400 hover:text-red-300">Delete account</button>
        <p className="text-[11px] text-ink-faint">All your boards and tasks will be permanently removed.</p>
      </Section>
    </>
  );
}