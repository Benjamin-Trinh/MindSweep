import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../theme/theme';

type Theme = 'light' | 'dark' | 'system';

type ThemeColors = typeof lightTheme;

type ThemeContextType = {
  theme: Theme;
  current: 'light' | 'dark';
  setThemeMode: (mode: Theme) => void;
  themeColors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  current: 'light',
  setThemeMode: () => {},
  themeColors: lightTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getSystemTheme = () => Appearance.getColorScheme() as 'light' | 'dark';
  const [theme, setTheme] = useState<Theme>('system');
  const [color, setColor] = useState<'light' | 'dark'>(getSystemTheme() || 'light');

  useEffect(() => {
    const update = () => {
      const system = getSystemTheme() || 'light';
      setColor(theme === 'system' ? system : theme);
    };
    update();
    const sub = Appearance.addChangeListener(update);
    return () => sub.remove();
  }, [theme]);

  const setThemeMode = (mode: Theme) => setTheme(mode);

  const themeColors = color === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, current: color, setThemeMode, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);