
import { Theme } from '@/types/theme';

export const themes: Theme[] = [
  {
    name: 'Default',
    id: 'default',
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      cardForeground: '240 10% 3.9%',
      popover: '0 0% 100%',
      popoverForeground: '240 10% 3.9%',
      primary: '240 5.9% 10%',
      primaryForeground: '0 0% 98%',
      secondary: '240 4.8% 95.9%',
      secondaryForeground: '240 5.9% 10%',
      muted: '240 4.8% 95.9%',
      mutedForeground: '240 3.8% 46.1%',
      accent: '240 4.8% 95.9%',
      accentForeground: '240 5.9% 10%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      border: '240 5.9% 90%',
      input: '240 5.9% 90%',
      ring: '240 5.9% 10%'
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      card: '240 10% 3.9%',
      cardForeground: '0 0% 98%',
      popover: '240 10% 3.9%',
      popoverForeground: '0 0% 98%',
      primary: '0 0% 98%',
      primaryForeground: '240 5.9% 10%',
      secondary: '240 3.7% 15.9%',
      secondaryForeground: '0 0% 98%',
      muted: '240 3.7% 15.9%',
      mutedForeground: '240 5% 64.9%',
      accent: '240 3.7% 15.9%',
      accentForeground: '0 0% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '0 0% 98%',
      border: '240 3.7% 15.9%',
      input: '240 3.7% 15.9%',
      ring: '240 4.9% 83.9%'
    }
  },
  {
    name: 'Ocean',
    id: 'ocean',
    light: {
      background: '200 20% 98%',
      foreground: '200 50% 3%',
      card: '200 20% 98%',
      cardForeground: '200 50% 3%',
      popover: '200 20% 98%',
      popoverForeground: '200 50% 3%',
      primary: '200 89% 45%',
      primaryForeground: '200 20% 98%',
      secondary: '200 20% 94%',
      secondaryForeground: '200 50% 3%',
      muted: '200 20% 94%',
      mutedForeground: '200 50% 40%',
      accent: '200 20% 94%',
      accentForeground: '200 50% 3%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      border: '200 20% 88%',
      input: '200 20% 88%',
      ring: '200 89% 45%'
    },
    dark: {
      background: '200 50% 3%',
      foreground: '200 20% 98%',
      card: '200 50% 3%',
      cardForeground: '200 20% 98%',
      popover: '200 50% 3%',
      popoverForeground: '200 20% 98%',
      primary: '200 89% 45%',
      primaryForeground: '200 20% 98%',
      secondary: '200 50% 10%',
      secondaryForeground: '200 20% 98%',
      muted: '200 50% 10%',
      mutedForeground: '200 20% 70%',
      accent: '200 50% 10%',
      accentForeground: '200 20% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '0 0% 98%',
      border: '200 50% 10%',
      input: '200 50% 10%',
      ring: '200 89% 45%'
    }
  },
  {
    name: 'Purple',
    id: 'purple',
    light: {
      background: '250 20% 98%',
      foreground: '250 50% 3%',
      card: '250 20% 98%',
      cardForeground: '250 50% 3%',
      popover: '250 20% 98%',
      popoverForeground: '250 50% 3%',
      primary: '250 89% 45%',
      primaryForeground: '250 20% 98%',
      secondary: '250 20% 94%',
      secondaryForeground: '250 50% 3%',
      muted: '250 20% 94%',
      mutedForeground: '250 50% 40%',
      accent: '250 20% 94%',
      accentForeground: '250 50% 3%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      border: '250 20% 88%',
      input: '250 20% 88%',
      ring: '250 89% 45%'
    },
    dark: {
      background: '250 50% 3%',
      foreground: '250 20% 98%',
      card: '250 50% 3%',
      cardForeground: '250 20% 98%',
      popover: '250 50% 3%',
      popoverForeground: '250 20% 98%',
      primary: '250 89% 45%',
      primaryForeground: '250 20% 98%',
      secondary: '250 50% 10%',
      secondaryForeground: '250 20% 98%',
      muted: '250 50% 10%',
      mutedForeground: '250 20% 70%',
      accent: '250 50% 10%',
      accentForeground: '250 20% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '0 0% 98%',
      border: '250 50% 10%',
      input: '250 50% 10%',
      ring: '250 89% 45%'
    }
  }
];

export const getThemeById = (id: string): Theme => {
  return themes.find((theme) => theme.id === id) || themes[0];
};

export const getDefaultTheme = (): string => {
  if (typeof window !== 'undefined') {
    return window.env?.VITE_DEFAULT_THEME || import.meta.env.VITE_DEFAULT_THEME || 'default';
  }
  return 'default';
};
