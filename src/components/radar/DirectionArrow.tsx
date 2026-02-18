import React, { useMemo } from 'react';
import { Polygon } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface DirectionArrowProps {
  size: number;
  rotation: number;
}

export const DirectionArrow: React.FC<DirectionArrowProps> = React.memo(({
  size,
  rotation,
}) => {
  const center = size / 2;
  const arrowSize = 30;

  // Validate and normalize rotation value
  const safeRotation = useMemo(() => {
    if (!Number.isFinite(rotation)) {
      console.warn('DirectionArrow: Invalid rotation value', rotation);
      return 0;
    }
    return ((rotation % 360) + 360) % 360; // Normalize to 0-360
  }, [rotation]);

  // Triangle pointing up (north)
  // Points: top, bottom-left, bottom-right
  const points = useMemo(() =>
    `${center},${center - arrowSize} ${center - arrowSize / 2},${
      center + arrowSize / 2
    } ${center + arrowSize / 2},${center + arrowSize / 2}`,
    [center, arrowSize]
  );

  return (
    <Polygon
      points={points}
      fill={theme.colors.accent.yellow}
      transform={`rotate(${safeRotation} ${center} ${center})`}
    />
  );
});
