import { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { MOCK_WEBHOOKS, MOCK_DELIVERIES } from '@/lib/mockSettings';
import { PageHeader, Section, Pill } from './primitives';

const EVENTS = ['task.created', 'task.updated', 'task.moved', 'task.deleted'];

export default function SettingsWebhooks() {
  const { pushToast } = useApp();
  const [hooks, setHooks] = useState(MOCK_WEBHOOKS);
  const [expanded, setExpanded] = useState(null);
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');

  const create = () => {
    const u = url.trim();
    if (!u.startsWith('https://')) {
      pushToast('URL must start with https://', 'error');
      return;
    }
    const h = {
      id: 'wh-' + Date.now(),
      url: u,
      description: desc.trim() || null,
      events: [...EVENTS],
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setHooks((prev) => [h, ...prev]);
    setUrl('');
    setDesc('');
    pushToast('Endpoint created.', 'success');
  };

  const remove = (id) => {
    setHooks((prev) => prev.filter((h) => h.id !== id));
    pushToast('Endpoint removed.', 'success');
  };

  const toggle = (id) => {
    setHooks((prev) => prev.map((h) => (h.id === id ? { ...h, is_active: !h.is_active } : h)));
  };

  return (
    <>
      <PageHeader title="Webhooks" description="Receive signed HTTPS POSTs on every task mutation." />

      <Section title="Add an endpoint">
        <div className="space-y-2">
          <input type="url" placeholder="https://example.com/hooks/tudu" value={url} onChange={(e) => setUrl(e.target.value)} className="input w-full" />
          <input type="text" placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} className="input w-full" />
          <button type="button" onClick={create} className="btn-accent !py-1.5 !text-[12px]">
            <Plus className="h-3.5 w-3.5" /> Create endpoint
          </button>
        </div>
      </Section>

      <Section title="Endpoints">
        {hooks.length === 0 ? (
          <p className="text-[12px] text-ink-faint">No endpoints yet.</p>
        ) : (
          <ul className="space-y-2">
            {hooks.map((h) => {
              const deliveries = MOCK_DELIVERIES.filter((d) => d.endpoint_id === h.id);
              const isOpen = expanded === h.id;
              return (
                <li key={h.id} className="rounded-lg border border-line-subtle bg-canvas">
                  <div className="flex flex-wrap items-center gap-2 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{h.url}</p>
                      <p className="mt-0.5 truncate text-[11px] text-ink-faint">
                        {h.description || 'No description'} - {h.is_active ? 'Active' : 'Paused'} - {h.events.length} event{h.events.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <button type="button" onClick={() => setExpanded(isOpen ? null : h.id)} className="rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-muted hover:border-line-strong hover:text-ink">
                      {isOpen ? 'Hide' : 'Deliveries'}
                    </button>
                    <button type="button" onClick={() => toggle(h.id)} className="rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-muted hover:border-line-strong hover:text-ink">
                      {h.is_active ? 'Pause' : 'Resume'}
                    </button>
                    <button type="button" onClick={() => remove(h.id)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 px-3 pb-2">
                    {h.events.map((e) => (
                      <span key={e} className="rounded-sm bg-line-subtle px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">{e}</span>
                    ))}
                  </div>
                  {isOpen && (
                    <div className="border-t border-line-subtle p-3">
                      {deliveries.length === 0 ? (
                        <p className="text-[11px] text-ink-faint">No deliveries yet.</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {deliveries.map((d) => (
                            <li key={d.id} className="flex flex-wrap items-center gap-2 rounded-md border border-line-subtle bg-surface px-2 py-1.5 text-[11px]">
                              <span className="font-mono text-ink-muted">{d.event_type}</span>
                              <Pill tone={d.status === 'success' ? 'brand' : d.status === 'dead' ? 'danger' : 'warn'}>{d.status}</Pill>
                              <span className="text-ink-faint">attempts {d.attempt_count}</span>
                              {d.last_response_status != null && <span className="text-ink-faint">HTTP {d.last_response_status}</span>}
                              {d.status === 'dead' && (
                                <button type="button" onClick={() => pushToast('Delivery requeued.', 'success')} className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium text-brand hover:bg-brand-subtle">
                                  <RefreshCw className="h-2.5 w-2.5" /> Retry
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </>
  );
}