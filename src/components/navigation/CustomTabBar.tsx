import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { TabBarIcon } from './TabBarIcon';

const TAB_BAR_HEIGHT = 70;

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  // Simple press scale animation
  const tabPressAnims = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

  const handleTabPress = (index: number, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Subtle scale animation
      Animated.sequence([
        Animated.timing(tabPressAnims[index], {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(tabPressAnims[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      navigation.navigate(state.routes[index].name);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          height: TAB_BAR_HEIGHT + insets.bottom,
        },
      ]}
    >
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel?.toString() || route.name;
          const isFocused = state.index === index;

          const iconType = route.name === 'DestinationsTab' ? 'radar' : 'collection';

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={() => handleTabPress(index, isFocused)}
              style={styles.tabButton}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  { transform: [{ scale: tabPressAnims[index] }] },
                ]}
              >
                <TabBarIcon type={iconType} active={isFocused} size={24} />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? theme.colors.accent.cyan : theme.colors.text.muted },
                  ]}
                >
                  {label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
});
