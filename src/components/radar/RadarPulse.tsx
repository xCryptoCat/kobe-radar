import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface RadarPulseProps {
  size: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const RadarPulse: React.FC<RadarPulseProps> = React.memo(({ size }) => {
  const center = size / 2;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 2.5,
            duration: 2000,
            useNativeDriver: false, // SVG doesn't support native driver
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0.8,
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
  }, []); // Fixed: Removed Animated refs from dependency array

  // Calculate radius based on scale
  const radius = scale.interpolate({
    inputRange: [1, 2.5],
    outputRange: [10, center],
  });

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={styles.svg}
      pointerEvents="none"
    >
      <AnimatedCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={theme.colors.accent.cyan}
        strokeWidth={2}
        fill="none"
        opacity={opacity}
      />
    </Svg>
  );
});

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
  },
});
