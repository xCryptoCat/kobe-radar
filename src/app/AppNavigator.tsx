import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { DestinationSelectScreen } from '../screens/DestinationSelectScreen';
import { RadarNavigationScreen } from '../screens/RadarNavigationScreen';
import { ArrivalCelebrationScreen } from '../screens/ArrivalCelebrationScreen';
import { StampCardScreen } from '../screens/StampCardScreen';
import { theme } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: theme.colors.accent.cyan,
          background: theme.colors.background.primary,
          card: theme.colors.background.secondary,
          text: theme.colors.text.primary,
          border: theme.colors.accent.cyan,
          notification: theme.colors.accent.teal,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="DestinationSelect"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="DestinationSelect"
          component={DestinationSelectScreen}
        />
        <Stack.Screen
          name="RadarNavigation"
          component={RadarNavigationScreen}
        />
        <Stack.Screen
          name="ArrivalCelebration"
          component={ArrivalCelebrationScreen}
        />
        <Stack.Screen name="StampCard" component={StampCardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
