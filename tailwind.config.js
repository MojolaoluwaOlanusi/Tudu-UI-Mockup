/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        raised: 'var(--bg-elevated)',
        subtle: 'var(--bg-hover)',
        active: 'var(--bg-active)',
        line: {
          DEFAULT: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          faint: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },
        brand: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
          muted: 'var(--accent-muted)',
        },
        todo: 'var(--status-todo)',
        doing: 'var(--status-doing)',
        done: 'var(--status-done)',
        overdue: 'var(--status-overdue)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        brand: ['Caveat', '"Comic Sans MS"', 'cursive'],
        handwritten: ['Caveat', '"Comic Sans MS"', 'cursive'],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'check-draw': {
          '0%': { strokeDashoffset: '48' },
          '60%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms cubic-bezier(0.2, 0, 0, 1)',
        'slide-up': 'slide-up 260ms cubic-bezier(0.3, 0, 0, 1)',
        'slide-in-right': 'slide-in-right 200ms cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};