import { useEffect, useState } from 'react';

const SIZES = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-12',
};

function readTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export default function Wordmark({ size = 'md', className = '', alt = 'Tudu' }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const src = theme === 'dark' ? '/wordmark-dark.png' : '/wordmark.png';
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <img
      src={src}
      alt={alt}
      className={sizeClass + ' w-auto select-none ' + className}
      draggable={false}
    />
  );
}