import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, Line, Rect, G } from 'react-native-svg';
import { theme } from '../../constants/theme';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface TabBarIconProps {
  type: 'radar' | 'collection';
  active: boolean;
  size?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  type,
  active,
  size = 28,
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (type === 'radar' && active) {
      // Rotate outer ring continuously
      const animation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => animation.stop();
    } else {
      rotationAnim.setValue(0);
    }
  }, [type, active, rotationAnim]);

  useEffect(() => {
    if (type === 'collection' && active) {
      // Pulse center square
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [type, active, pulseAnim]);

  const color = active ? theme.colors.accent.cyan : theme.colors.text.muted;
  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 360],
  });

  if (type === 'radar') {
    return (
      <Svg width={size} height={size} viewBox="0 0 28 28">
        {/* Center dot */}
        <Circle cx="14" cy="14" r="2" fill={color} />

        {/* Directional lines (crosshair) */}
        <Line x1="14" y1="4" x2="14" y2="10" stroke={color} strokeWidth="2" />
        <Line x1="14" y1="18" x2="14" y2="24" stroke={color} strokeWidth="2" />
        <Line x1="4" y1="14" x2="10" y2="14" stroke={color} strokeWidth="2" />
        <Line x1="18" y1="14" x2="24" y2="14" stroke={color} strokeWidth="2" />

        {/* Rotating outer ring (only when active) */}
        {active && (
          <AnimatedG origin="14, 14" rotation={rotation}>
            <Circle
              cx="14"
              cy="14"
              r="10"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
          </AnimatedG>
        )}
      </Svg>
    );
  }

  // Collection grid icon
  const centerColor = active ? theme.colors.accent.teal : theme.colors.text.muted;
  const squareSize = 6;
  const spacing = 3;
  const startPos = 5;

  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      {/* 3x3 grid of squares */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => {
          const x = startPos + col * (squareSize + spacing);
          const y = startPos + row * (squareSize + spacing);
          const isCenter = row === 1 && col === 1;

          if (isCenter && active) {
            // Animated center square with pulsing opacity
            return (
              <AnimatedRect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width={squareSize}
                height={squareSize}
                fill={centerColor}
                rx="1"
                opacity={pulseAnim}
              />
            );
          }

          return (
            <Rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width={squareSize}
              height={squareSize}
              fill={isCenter ? centerColor : color}
              rx="1"
            />
          );
        })
      )}
    </Svg>
  );
};
