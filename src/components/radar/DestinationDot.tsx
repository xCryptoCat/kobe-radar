import React, { useState, useEffect } from 'react';
import { Circle, G, Rect, Text } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { calculateRadarPosition, polarToCartesian } from '../../utils/radarPosition';
import { theme } from '../../constants/theme';

interface DestinationDotProps {
  size: number;
  distance: number;
  relativeAngle: number;
  color: string;
  spotName: string;
}

export const DestinationDot: React.FC<DestinationDotProps> = ({
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

  // Calculate position using polar to cartesian conversion
  const scaledRadius = calculateRadarPosition(distance, maxRadius);
  const { x, y } = polarToCartesian(center, scaledRadius, relativeAngle);

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

  // Tooltip dimensions
  const tooltipPadding = 8;
  const tooltipHeight = 30;
  const estimatedTextWidth = spotName.length * 8 + tooltipPadding * 2;
  const tooltipX = x - estimatedTextWidth / 2;
  const tooltipY = y - tooltipHeight - 10; // Position above dot

  return (
    <G onPress={handlePress}>
      {/* Outer glow circle */}
      <Circle
        cx={x}
        cy={y}
        r={outerDotRadius}
        fill={color}
        opacity={0.4}
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
};
