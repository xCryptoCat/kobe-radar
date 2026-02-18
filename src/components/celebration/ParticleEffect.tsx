import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../../constants/theme';

interface ParticleProps {
  angle: number;
  delay: number;
}

const Particle: React.FC<ParticleProps> = ({ angle, delay }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(progress, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, progress]);

  const distance = 60;
  const radian = (angle * Math.PI) / 180;
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.cos(radian) * distance],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.sin(radian) * distance],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [{ translateX }, { translateY }],
          opacity,
        },
      ]}
    />
  );
};

export const ParticleEffect: React.FC = () => {
  const particleCount = 8;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    angle: (360 / particleCount) * i,
    delay: 0,
  }));

  return (
    <View style={styles.container}>
      {particles.map((particle, index) => (
        <Particle key={index} angle={particle.angle} delay={particle.delay} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.cyan,
    opacity: 0.8,
  },
});
