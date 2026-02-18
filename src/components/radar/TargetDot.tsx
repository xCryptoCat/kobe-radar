import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Circle, G } from 'react-native-svg';
import { theme } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TargetDotProps {
  size: number;
}

export const TargetDot: React.FC<TargetDotProps> = ({ size }) => {
  const center = size / 2;
  const dotRadius = 8;

  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 2.5,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseScale, pulseOpacity]);

  const pulseRadius = pulseScale.interpolate({
    inputRange: [1, 2.5],
    outputRange: [dotRadius, dotRadius * 2.5],
  });

  return (
    <G>
      {/* Animated pulse ring */}
      <AnimatedCircle
        cx={center}
        cy={center}
        r={pulseRadius}
        fill="none"
        stroke={theme.colors.accent.cyan}
        strokeWidth={2}
        opacity={pulseOpacity}
      />

      {/* Outer glow */}
      <Circle
        cx={center}
        cy={center}
        r={dotRadius + 4}
        fill={theme.colors.text.primary}
        opacity={0.3}
      />

      {/* Inner dot */}
      <Circle
        cx={center}
        cy={center}
        r={dotRadius}
        fill={theme.colors.text.primary}
      />
    </G>
  );
};
