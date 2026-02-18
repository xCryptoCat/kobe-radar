import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../constants/theme';

interface CompletionOverlayProps {
  spotName: string;
}

export const CompletionOverlay: React.FC<CompletionOverlayProps> = ({
  spotName,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
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
