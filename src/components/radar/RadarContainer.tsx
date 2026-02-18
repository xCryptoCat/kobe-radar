import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import { RadarCircle } from './RadarCircle';
import { RadarGrid } from './RadarGrid';
import { DirectionArrow } from './DirectionArrow';
import { TargetDot } from './TargetDot';
import { ProximityZone } from '../../types/radar';
import { theme } from '../../constants/theme';

interface RadarContainerProps {
  relativeAngle: number;
  proximityZone: ProximityZone;
  size?: number;
}

export const RadarContainer: React.FC<RadarContainerProps> = ({
  relativeAngle,
  proximityZone,
  size = 300,
}) => {
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Concentric circles */}
        {rings.map((ratio, index) => (
          <RadarCircle
            key={index}
            size={size}
            radius={(size / 2) * ratio}
            proximityZone={proximityZone}
          />
        ))}

        {/* Grid crosshairs */}
        <RadarGrid size={size} />

        {/* Direction arrow */}
        <DirectionArrow size={size} rotation={relativeAngle} />

        {/* Center target dot */}
        <TargetDot size={size} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
  },
});
