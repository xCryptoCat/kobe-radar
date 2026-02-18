import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Animated } from 'react-native';
import { Circle, G, Rect, Text } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { calculateRadarPosition, polarToCartesian } from '../../utils/radarPosition';
import { theme } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DestinationDotProps {
  size: number;
  distance: number;
  relativeAngle: number;
  color: string;
  spotName: string;
}

export const DestinationDot: React.FC<DestinationDotProps> = React.memo(({
  size,
  distance,
  relativeAngle,
  color,
  spotName,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const center = size / 2;
  const maxRadius = center;
  const outerDotRadius = 12;
  const innerDotRadius = 10;

  const position = useMemo(() => {
    const scaledRadius = calculateRadarPosition(distance, maxRadius);
    return polarToCartesian(center, scaledRadius, relativeAngle);
  }, [distance, relativeAngle, center, maxRadius]);

  const { x, y } = position;

  // Pulse animation
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 2.0,
            duration: 1800,
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
            duration: 1800,
            useNativeDriver: false,
          }),
          Animated.timing(pulseOpacity, {
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

  const pulseRadius = pulseScale.interpolate({
    inputRange: [1, 2.0],
    outputRange: [innerDotRadius, innerDotRadius * 2.0],
  });

  // Handle tap interaction
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTooltip(true);
  };

  // Auto-dismiss tooltip after 2 seconds
  useEffect(() => {
    if (showTooltip) {
      const timeout = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [showTooltip]);

  // Tooltip dimensions with better Japanese text handling
  const tooltipPadding = 8;
  const tooltipHeight = 30;

  // Better estimation for Japanese text (uses wider character width)
  const estimatedTextWidth = useMemo(() => {
    // Japanese characters are wider; use conservative estimate
    const avgCharWidth = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(spotName) ? 12 : 8;
    return spotName.length * avgCharWidth + tooltipPadding * 2;
  }, [spotName, tooltipPadding]);

  const tooltipX = x - estimatedTextWidth / 2;
  const tooltipY = y - tooltipHeight - 10; // Position above dot

  return (
    <G onPress={handlePress}>
      {/* Animated pulse ring */}
      <AnimatedCircle
        cx={x}
        cy={y}
        r={pulseRadius}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={pulseOpacity}
      />

      {/* Inner solid circle */}
      <Circle
        cx={x}
        cy={y}
        r={innerDotRadius}
        fill={color}
      />

      {/* Tooltip */}
      {showTooltip && (
        <G>
          {/* Tooltip background */}
          <Rect
            x={tooltipX}
            y={tooltipY}
            width={estimatedTextWidth}
            height={tooltipHeight}
            fill={theme.colors.background.secondary}
            opacity={0.95}
            rx={4}
            ry={4}
          />
          {/* Tooltip text */}
          <Text
            x={x}
            y={tooltipY + tooltipHeight / 2 + 5}
            fill={theme.colors.text.primary}
            fontSize={12}
            fontWeight="600"
            textAnchor="middle"
          >
            {spotName}
          </Text>
        </G>
      )}
    </G>
  );
});
