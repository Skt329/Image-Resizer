export type Theme = 'dark' | 'light';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  const stored = localStorage.getItem('theme') as Theme;
  if (stored) return stored;
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'dark'; // Default to dark mode
}

export function setTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', theme);
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}
