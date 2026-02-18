import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

interface CompletionOverlayProps {
  spotName: string;
}

export const CompletionOverlay: React.FC<CompletionOverlayProps> = ({
  spotName,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      200,
      withSpring(1, { damping: 10, stiffness: 100 })
    );
    opacity.value = withDelay(200, withSpring(1));
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.celebrationText}>探索コンプリート!</Text>
        <Text style={styles.spotName}>{spotName}発見!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xxl,
  },
  content: {
    alignItems: 'center',
  },
  celebrationText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.accent.cyan,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  spotName: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});
