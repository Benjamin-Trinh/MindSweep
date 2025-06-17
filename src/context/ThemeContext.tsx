declare module 'react-native' {
  interface AccessibilityInfoStatic {
    getFontScale?: () => Promise<number>;
  }
}

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Appearance, View, ActivityIndicator, AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

type ThemeColors = {
  background: string;
  text: string;
  card: string;
  tag: string;
  tagText: string;
  highlight: string;
  border: string;
  placeholder: string;
  danger: string;
};

type ThemeContextType = {
  theme: Theme;
  current: 'light' | 'dark';
  setThemeMode: (mode: Theme) => void;
  themeColors: ThemeColors;
  fontScale: number;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  current: 'light',
  setThemeMode: () => {},
  themeColors: {
    background: '#fff',
    text: '#000',
    card: '#f2f2f2',
    tag: '#e6e6e6',
    tagText: '#333',
    highlight: '#4e91fc',
    border: '#ccc',
    placeholder: '#888',
    danger: '#ff4d4d',
  },
  fontScale: 1,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [isReady, setIsReady] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    const init = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@theme');
        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
          setTheme(storedTheme);
        }

        const initialSystem = Appearance.getColorScheme() || 'light';
        setSystemTheme(initialSystem);

        const scale = AccessibilityInfo.getFontScale
          ? await AccessibilityInfo.getFontScale()
          : 1;
        setFontScale(scale);
      } catch (error) {
        console.warn('ThemeContext init error:', error);
      } finally {
        setIsReady(true);
      }
    };

    init();

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => sub.remove();
  }, []);

  const current = useMemo(() => (theme === 'system' ? systemTheme : theme), [theme, systemTheme]);

  const themeColors = useMemo<ThemeColors>(() => ({
    background: current === 'dark' ? '#121212' : '#fff',
    text: current === 'dark' ? '#fff' : '#000',
    card: current === 'dark' ? '#1e1e1e' : '#f2f2f2',
    tag: current === 'dark' ? '#333' : '#e6e6e6',
    tagText: current === 'dark' ? '#fff' : '#333',
    highlight: '#4e91fc',
    border: current === 'dark' ? '#444' : '#ccc',
    placeholder: current === 'dark' ? '#aaa' : '#888',
    danger: '#ff4d4d',
  }), [current]);

  const setThemeMode = async (mode: Theme) => {
    setTheme(mode);
    await AsyncStorage.setItem('@theme', mode);
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, current, setThemeMode, themeColors, fontScale }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
