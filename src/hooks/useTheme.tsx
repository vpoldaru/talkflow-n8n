
import { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeMode } from '@/types/theme';
import { themes, getThemeById, getDefaultTheme } from '@/config/themes';
import { useToast } from './use-toast';

type ThemeContextType = {
  currentTheme: Theme;
  mode: ThemeMode;
  setTheme: (themeId: string) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedThemeId = localStorage.getItem('themeId') || getDefaultTheme();
    return getThemeById(savedThemeId);
  });
  
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode;
      if (savedMode) return savedMode;
      
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  });

  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    setCurrentTheme(theme);
    localStorage.setItem('themeId', themeId);
    applyTheme(theme, mode);
    toast({
      description: `Theme changed to ${theme.name}`,
    });
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
    document.documentElement.classList.toggle('dark', newMode === 'dark');
    applyTheme(currentTheme, newMode);
    toast({
      description: `Switched to ${newMode} mode`,
    });
  };

  const applyTheme = (theme: Theme, currentMode: ThemeMode) => {
    const colors = currentMode === 'light' ? theme.light : theme.dark;
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
      // Also set HSL values for Tailwind
      if (typeof value === 'string' && value.includes(' ')) {
        root.style.setProperty(`--${key}-hsl`, value);
      }
    });
  };

  // Apply theme on initial load and when system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('themeMode')) {
        const newMode = e.matches ? 'dark' : 'light';
        setMode(newMode);
        document.documentElement.classList.toggle('dark', e.matches);
        applyTheme(currentTheme, newMode);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    applyTheme(currentTheme, mode);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme, mode]);

  return (
    <ThemeContext.Provider value={{ currentTheme, mode, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
