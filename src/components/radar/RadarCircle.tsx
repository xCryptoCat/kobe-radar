import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { ProximityZone } from '../../types/radar';
import { theme } from '../../constants/theme';

interface RadarCircleProps {
  size: number;
  radius: number;
  proximityZone: ProximityZone;
}

const getColorForZone = (zone: ProximityZone): string => {
  switch (zone) {
    case 'arrived':
      return theme.colors.radar.arrived;
    case 'near':
      return theme.colors.radar.near;
    case 'medium':
      return theme.colors.radar.medium;
    case 'far':
    default:
      return theme.colors.radar.far;
  }
};

export const RadarCircle: React.FC<RadarCircleProps> = React.memo(({
  size,
  radius,
  proximityZone,
}) => {
  const color = getColorForZone(proximityZone);
  const center = size / 2;

  return (
    <Circle
      cx={center}
      cy={center}
      r={radius}
      stroke={color}
      strokeWidth={2}
      fill="none"
      opacity={0.6}
    />
  );
});
