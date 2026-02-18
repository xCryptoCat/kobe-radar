import React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  TabParamList,
  DestinationsStackParamList,
  StampsStackParamList,
} from '../types/navigation';
import { DestinationSelectScreen } from '../screens/DestinationSelectScreen';
import { RadarNavigationScreen } from '../screens/RadarNavigationScreen';
import { ArrivalCelebrationScreen } from '../screens/ArrivalCelebrationScreen';
import { StampCardScreen } from '../screens/StampCardScreen';
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import { theme } from '../constants/theme';

const DestinationsStack =
  createNativeStackNavigator<DestinationsStackParamList>();
const StampsStack = createNativeStackNavigator<StampsStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Destinations Tab - contains exploration flow
const DestinationsNavigator: React.FC = () => {
  return (
    <DestinationsStack.Navigator
      initialRouteName="DestinationSelect"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <DestinationsStack.Screen
        name="DestinationSelect"
        component={DestinationSelectScreen}
      />
      <DestinationsStack.Screen
        name="RadarNavigation"
        component={RadarNavigationScreen}
      />
      <DestinationsStack.Screen
        name="ArrivalCelebration"
        component={ArrivalCelebrationScreen}
      />
    </DestinationsStack.Navigator>
  );
};

// Stamps Tab - contains stamp collection
const StampsNavigator: React.FC = () => {
  return (
    <StampsStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <StampsStack.Screen name="StampCard" component={StampCardScreen} />
    </StampsStack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  // Helper to determine if tab bar should be hidden
  const getTabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    // Hide tab bar on RadarNavigation and ArrivalCelebration screens
    const hiddenScreens = ['RadarNavigation', 'ArrivalCelebration'];
    return hiddenScreens.includes(routeName || '') ? 'none' : 'flex';
  };

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
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="DestinationsTab"
          component={DestinationsNavigator}
          options={({ route }) => ({
            tabBarLabel: '探索',
            tabBarStyle: { display: getTabBarVisibility(route) },
          })}
        />
        <Tab.Screen
          name="StampsTab"
          component={StampsNavigator}
          options={{
            tabBarLabel: 'スタンプ',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
