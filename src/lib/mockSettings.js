export const MOCK_TOKENS = [
  { id: 'tok-1', label: 'Home Assistant', prefix: 'tudu_pat_a1b2c3d4', last_used_at: '2026-10-22T10:30:00Z', created_at: '2026-10-01T09:00:00Z' },
  { id: 'tok-2', label: 'Zapier', prefix: 'tudu_pat_x9y8z7w6', last_used_at: null, created_at: '2026-10-15T11:00:00Z' },
];

export const MOCK_WEBHOOKS = [
  { id: 'wh-1', url: 'https://example.com/hooks/tudu', description: 'Production webhook', events: ['task.created', 'task.updated', 'task.moved'], is_active: true, created_at: '2026-10-01T09:00:00Z' },
  { id: 'wh-2', url: 'https://staging.example.com/hook', description: 'Staging receiver', events: ['task.deleted'], is_active: false, created_at: '2026-10-05T14:00:00Z' },
];

export const MOCK_DELIVERIES = [
  { id: 'd-1', endpoint_id: 'wh-1', event_type: 'task.created', status: 'success', attempt_count: 1, last_response_status: 200, created_at: '2026-10-22T14:23:00Z' },
  { id: 'd-2', endpoint_id: 'wh-1', event_type: 'task.updated', status: 'dead', attempt_count: 6, last_response_status: 500, created_at: '2026-10-22T14:20:00Z' },
];

export const MOCK_PAYMENTS = [
  { id: 'p-1', reference: 'ref_pro_oct_2026', amount_kobo: 750000, currency: 'NGN', status: 'success', purpose: 'subscription', channel: 'card', created_at: '2026-10-15T10:00:00Z' },
  { id: 'p-2', reference: 'ref_credits_500', amount_kobo: 200000, currency: 'NGN', status: 'success', purpose: 'ai_credits', channel: 'card', created_at: '2026-10-10T16:45:00Z' },
];

export const MOCK_WORKSPACE_MEMBERS = [
  { id: 'u-me', name: 'Mojola', email: 'mojola@tudu.app', role: 'admin', status: 'accepted' },
  { id: 'u-2', name: 'Doyin Olanusi', email: 'doyin@tudu.app', role: 'member', status: 'accepted' },
  { id: 'u-3', name: 'Bisi Adebayo', email: 'bisi@tudu.app', role: 'viewer', status: 'pending' },
];

export const MOCK_LICENSES = [
  { id: 'lic-1', fingerprint: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', tier: 'pro', issued_at: '2026-10-01T09:00:00Z', expires_at: '2027-10-01T09:00:00Z', revoked_at: null, notes: 'Production server, eu-west-1' },
];

export const MOCK_INTEGRATIONS = {
  github: { connected: true, login: 'mojola', since: '2026-09-01T09:00:00Z' },
  slack: { connected: false, teamName: null, channelName: null },
};