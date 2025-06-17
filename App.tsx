import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CaptureScreen from './src/screens/CaptureScreen';
import InboxScreen from './src/screens/InboxScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

function AppStack() {
  const { current, themeColors } = useTheme();
  const isDark = current === 'dark';
  const navTheme = React.useMemo(() => (isDark ? DarkTheme : DefaultTheme), [isDark]);

  return (

    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: navTheme.colors.card,
          },
          headerTitleStyle: {
            color: navTheme.colors.text,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="settings-outline" size={24} color={themeColors.text} />
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen name="Capture" component={CaptureScreen} />
        <Stack.Screen name="Inbox" component={InboxScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppStack />
    </ThemeProvider>
  );
}
