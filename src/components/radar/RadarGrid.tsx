import React from 'react';
import { Line } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface RadarGridProps {
  size: number;
}

export const RadarGrid: React.FC<RadarGridProps> = React.memo(({ size }) => {
  const center = size / 2;

  return (
    <>
      {/* Horizontal line */}
      <Line
        x1={0}
        y1={center}
        x2={size}
        y2={center}
        stroke={theme.colors.radar.grid}
        strokeWidth={1}
      />
      {/* Vertical line */}
      <Line
        x1={center}
        y1={0}
        x2={center}
        y2={size}
        stroke={theme.colors.radar.grid}
        strokeWidth={1}
      />
    </>
  );
});
