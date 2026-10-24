const DENSITY_KEY = 'tudu-density';

export function getDensity() {
  if (typeof window === 'undefined') return 'comfortable';
  try {
    return localStorage.getItem(DENSITY_KEY) === 'compact' ? 'compact' : 'comfortable';
  } catch {
    return 'comfortable';
  }
}

export function applyDensity(density) {
  if (typeof document === 'undefined') return;
  const d = density === 'compact' ? 'compact' : 'comfortable';
  document.documentElement.setAttribute('data-density', d);
  try { localStorage.setItem(DENSITY_KEY, d); } catch {}
}

export function toggleDensity() {
  const next = getDensity() === 'compact' ? 'comfortable' : 'compact';
  applyDensity(next);
  return next;
}