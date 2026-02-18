import React from 'react';
import { Polygon } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface DirectionArrowProps {
  size: number;
  rotation: number;
}

export const DirectionArrow: React.FC<DirectionArrowProps> = ({
  size,
  rotation,
}) => {
  const center = size / 2;
  const arrowSize = 30;

  // Triangle pointing up (north)
  // Points: top, bottom-left, bottom-right
  const points = `${center},${center - arrowSize} ${center - arrowSize / 2},${
    center + arrowSize / 2
  } ${center + arrowSize / 2},${center + arrowSize / 2}`;

  return (
    <Polygon
      points={points}
      fill={theme.colors.accent.yellow}
      transform={`rotate(${rotation} ${center} ${center})`}
    />
  );
};
