import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useLocalStorage<Theme>('focusup-theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);

  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
};
