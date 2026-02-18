import React from 'react';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { Polygon } from 'react-native-svg';
import { theme } from '../../constants/theme';

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

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

  const animatedProps = useAnimatedProps(() => {
    return {
      transform: `rotate(${rotation} ${center} ${center})`,
    };
  });

  return (
    <AnimatedPolygon
      points={points}
      fill={theme.colors.accent.yellow}
      animatedProps={animatedProps}
    />
  );
};
