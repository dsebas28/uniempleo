import { useEffect, useState } from 'react';

// Reads/toggles the `.dark` class on <html>. The initial class is already
// applied by the inline script in index.html (avoids a flash on load).
export function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
}
