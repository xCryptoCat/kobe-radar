import React from 'react';
import { Circle } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface TargetDotProps {
  size: number;
}

export const TargetDot: React.FC<TargetDotProps> = ({ size }) => {
  const center = size / 2;
  const dotRadius = 8;

  return (
    <>
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
    </>
  );
};
