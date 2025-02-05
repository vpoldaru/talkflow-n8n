
import { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeMode } from '@/types/theme';
import { themes, getThemeById, getDefaultTheme } from '@/config/themes';

type ThemeContextType = {
  currentTheme: Theme;
  mode: ThemeMode;
  setTheme: (themeId: string) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedThemeId = localStorage.getItem('themeId') || getDefaultTheme();
    return getThemeById(savedThemeId);
  });
  
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? 'dark' : 'light';
    }
    return 'light';
  });

  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    setCurrentTheme(theme);
    localStorage.setItem('themeId', themeId);
    applyTheme(theme, mode);
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    document.documentElement.classList.toggle('dark', newMode === 'dark');
    applyTheme(currentTheme, newMode);
  };

  const applyTheme = (theme: Theme, currentMode: ThemeMode) => {
    const colors = currentMode === 'light' ? theme.light : theme.dark;
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  useEffect(() => {
    applyTheme(currentTheme, mode);
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
