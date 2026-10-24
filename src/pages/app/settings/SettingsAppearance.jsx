import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyTheme, getTheme } from '@/lib/theme';
import { PageHeader, Section } from './primitives';

export default function SettingsAppearance() {
  const [theme, setThemeState] = useState(getTheme());
  const [density, setDensity] = useState('comfortable');

  const setTheme = (t) => {
    applyTheme(t);
    setThemeState(t);
  };

  return (
    <>
      <PageHeader title="Appearance" description="How Tudu looks and feels." />

      <Section title="Theme">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={
              'flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ' +
              (theme === 'dark' ? 'border-brand bg-brand-subtle' : 'border-line hover:border-line-strong')
            }
          >
            <Moon className={'h-4 w-4 ' + (theme === 'dark' ? 'text-brand' : 'text-ink-muted')} />
            <div>
              <p className="text-sm font-medium text-ink">Dark</p>
              <p className="text-[11px] text-ink-faint">Grey with tudu green</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={
              'flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ' +
              (theme === 'light' ? 'border-brand bg-brand-subtle' : 'border-line hover:border-line-strong')
            }
          >
            <Sun className={'h-4 w-4 ' + (theme === 'light' ? 'text-brand' : 'text-ink-muted')} />
            <div>
              <p className="text-sm font-medium text-ink">Light</p>
              <p className="text-[11px] text-ink-faint">Paper and ink</p>
            </div>
          </button>
        </div>
      </Section>

      <Section title="Density" description="Compact mode fits more rows.">
        <div className="flex gap-2">
          {['comfortable', 'compact'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDensity(d)}
              className={
                'rounded-md border px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ' +
                (density === d ? 'border-brand bg-brand-subtle text-brand' : 'border-line text-ink-muted hover:text-ink')
              }
            >
              {d}
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}