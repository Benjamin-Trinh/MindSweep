import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CaptureScreen from '../screens/CaptureScreen';
import InboxScreen from '../screens/InboxScreen';

const Tab = createMaterialTopTabNavigator();

export default function MainTabs() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarStyle: {
            paddingTop: 0, // Optional
          },
        }}
      >
        <Tab.Screen name="Capture" component={CaptureScreen} />
        <Tab.Screen name="Inbox" component={InboxScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
