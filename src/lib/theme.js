const THEME_KEY = 'tudu-theme';

export function getTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  html.classList.add(theme);
  html.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}