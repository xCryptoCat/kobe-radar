import React from 'react';
import { Text, G, Polygon } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface NorthIndicatorProps {
  size: number;
  heading: number; // Current compass heading in degrees
}

export const NorthIndicator: React.FC<NorthIndicatorProps> = ({ size, heading }) => {
  const center = size / 2;
  const radius = size / 2;
  const indicatorDistance = radius - 25; // Position inside the radar

  // North position (top of radar, 0°)
  const northX = center;
  const northY = center - indicatorDistance;

  // Small triangle pointing up (north arrow)
  const arrowSize = 8;
  const arrowPoints = `
    ${northX},${northY - arrowSize}
    ${northX - arrowSize / 2},${northY}
    ${northX + arrowSize / 2},${northY}
  `;

  // Rotate the entire group to point to true north
  // Negative heading because we want to counter-rotate
  const rotation = -heading;

  return (
    <G transform={`rotate(${rotation} ${center} ${center})`}>
      {/* North arrow */}
      <Polygon
        points={arrowPoints}
        fill={theme.colors.accent.cyan}
        opacity={0.8}
      />

      {/* "N" label */}
      <Text
        x={northX}
        y={northY + 18}
        fill={theme.colors.accent.cyan}
        fontSize={14}
        fontWeight="700"
        textAnchor="middle"
        opacity={0.9}
      >
        N
      </Text>
    </G>
  );
};
