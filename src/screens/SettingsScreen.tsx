import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { theme, current, setThemeMode, themeColors, fontScale } = useTheme();

  const setMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    Haptics.selectionAsync();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.heading, { color: themeColors.text, fontSize: 24 * fontScale }]}>Settings</Text>

      <Text style={[styles.label, { color: themeColors.text, fontSize: 16 * fontScale }]}>Select Theme:</Text>

      <View style={styles.optionsContainer}>
        {['light', 'dark', 'system'].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.optionButton,
              {
                backgroundColor: theme === mode ? themeColors.highlight : themeColors.card,
              },
            ]}
            onPress={() => setMode(mode as any)}
          >
            <Text
              style={{
                color: theme === mode ? '#fff' : themeColors.text,
                fontSize: 16 * fontScale,
              }}
            >
              {mode === 'system' ? 'Follow System Theme' : `${mode.charAt(0).toUpperCase()}${mode.slice(1)} Mode`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  heading: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    textAlign: 'left',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
});
