import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

interface ParticleProps {
  angle: number;
  delay: number;
}

const Particle: React.FC<ParticleProps> = ({ angle, delay }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 1000 })
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const distance = 100 * progress.value;
    const radian = (angle * Math.PI) / 180;
    const translateX = Math.cos(radian) * distance;
    const translateY = Math.sin(radian) * distance;

    return {
      transform: [{ translateX }, { translateY }],
      opacity: 1 - progress.value,
    };
  });

  return <Animated.View style={[styles.particle, animatedStyle]} />;
};

export const ParticleEffect: React.FC = () => {
  const particleCount = 20;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    angle: (360 / particleCount) * i,
    delay: i * 20,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent.cyan,
  },
});
