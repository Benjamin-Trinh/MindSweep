import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const modes = ['light', 'dark', 'system'] as const;

export default function SettingsScreen() {
  const { theme, setThemeMode, current } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: current === 'dark' ? '#121212' : '#fff' }]}>
      <Text style={[styles.title, { color: current === 'dark' ? '#fff' : '#000' }]}>Theme Settings</Text>

      {modes.map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.option,
            {
              backgroundColor:
                theme === mode ? '#4e91fc' : current === 'dark' ? '#333' : '#eee',
            },
          ]}
          onPress={() => setThemeMode(mode)}
        >
          <Text
            style={{
              color: theme === mode ? '#fff' : current === 'dark' ? '#fff' : '#000',
              fontWeight: theme === mode ? 'bold' : 'normal',
            }}
          >
            {mode === 'system' ? 'Follow System Theme' : `Use ${mode} mode`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
});
