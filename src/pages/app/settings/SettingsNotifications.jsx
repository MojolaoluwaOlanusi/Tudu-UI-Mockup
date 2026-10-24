import { useState } from 'react';
import { PageHeader, Section, ToggleRow } from './primitives';

export default function SettingsNotifications() {
  const [reminders, setReminders] = useState(true);
  const [celebrations, setCelebrations] = useState(true);
  const [push, setPush] = useState(false);

  return (
    <>
      <PageHeader title="Notifications" description="What we send you and when." />
      <Section title="Email">
        <ToggleRow title="Daily due-date reminders" description="One email a day for tasks due or overdue. Sent at 07:00 UTC." checked={reminders} onChange={setReminders} />
      </Section>
      <Section title="In-app">
        <ToggleRow title="Celebrations" description="A small confetti pop when you finish a task and at milestones." checked={celebrations} onChange={setCelebrations} />
      </Section>
      <Section title="Browser">
        <ToggleRow title="Browser notifications" description="A reminder appears even when Tudu is closed." checked={push} onChange={setPush} />
      </Section>
    </>
  );
}