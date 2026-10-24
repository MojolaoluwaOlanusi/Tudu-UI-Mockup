import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { toggleDensity } from '@/lib/density';

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function useAppShortcuts() {
  const navigate = useNavigate();
  const {
    openComposer,
    openCommandPalette, closeCommandPalette,
    openShortcutHelp, closeShortcutHelp,
    commandPaletteOpen, shortcutHelpOpen,
  } = useApp();
  const chord = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        closeShortcutHelp();
        openCommandPalette();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleDensity();
        return;
      }

      if (e.key === 'Escape') {
        chord.current = null;
        if (commandPaletteOpen) closeCommandPalette();
        if (shortcutHelpOpen) closeShortcutHelp();
        return;
      }

      if (isTypingTarget(e.target)) return;
      if (commandPaletteOpen || shortcutHelpOpen) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.toLowerCase() === 'g') {
        chord.current = Date.now();
        return;
      }
      if (chord.current && Date.now() - chord.current < 1200) {
        const key = e.key.toLowerCase();
        const map = { l: '/app', b: '/app/board', s: '/app/stats', a: '/app/analytics' };
        if (map[key]) {
          e.preventDefault();
          navigate(map[key]);
          chord.current = null;
          return;
        }
        chord.current = null;
      }

      if (e.key.toLowerCase() === 'n') {
        const path = window.location.hash.replace('#', '') || '/';
        if (path === '/app' || path === '/app/board') {
          e.preventDefault();
          openComposer();
        }
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        closeCommandPalette();
        openShortcutHelp();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, openComposer, openCommandPalette, closeCommandPalette, openShortcutHelp, closeShortcutHelp, commandPaletteOpen, shortcutHelpOpen]);
}