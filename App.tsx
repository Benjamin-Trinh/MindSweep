import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import CaptureScreen from './src/screens/CaptureScreen';
import InboxScreen from './src/screens/InboxScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function TabScreens() {
  return (
    <Tab.Navigator
      screenOptions={{ swipeEnabled: true }}
    >
      <Tab.Screen name="Capture" component={CaptureScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
    </Tab.Navigator>
  );
}

function AppStack() {
  const { current, themeColors } = useTheme();
  const isDark = current === 'dark';
  const navTheme = React.useMemo(() => (isDark ? DarkTheme : DefaultTheme), [isDark]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: navTheme.colors.card,
          },
          headerTitleStyle: {
            color: navTheme.colors.text,
          },
          headerRight: () =>
            route.name !== 'Settings' ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="settings-outline" size={24} color={themeColors.text} />
              </TouchableOpacity>
            ) : null,
        })}
      >
        <Stack.Screen name="Home" component={TabScreens} options={{ headerTitle: 'MindSweep' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppStack />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
