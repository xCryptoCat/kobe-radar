import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import { RadarCircle } from './RadarCircle';
import { RadarGrid } from './RadarGrid';
import { DirectionArrow } from './DirectionArrow';
import { TargetDot } from './TargetDot';
import { DestinationDot } from './DestinationDot';
import { RadarPulse } from './RadarPulse';
import { NorthIndicator } from './NorthIndicator';
import { ProximityZone } from '../../types/radar';
import { theme } from '../../constants/theme';

interface RadarContainerProps {
  relativeAngle: number;
  proximityZone: ProximityZone;
  size?: number;
  destinationDistance?: number;
  destinationAngle?: number;
  destinationColor?: string;
  destinationName?: string;
  heading?: number | null;
}

export const RadarContainer: React.FC<RadarContainerProps> = ({
  relativeAngle,
  proximityZone,
  size = 300,
  destinationDistance,
  destinationAngle,
  destinationColor,
  destinationName,
  heading = 0,
}) => {
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <View style={styles.container}>
      {/* Radar pulse wave animation */}
      <RadarPulse size={size} />

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

        {/* North indicator */}
        <NorthIndicator size={size} heading={heading || 0} />

        {/* Direction arrow */}
        <DirectionArrow size={size} rotation={relativeAngle} />

        {/* Center target dot */}
        <TargetDot size={size} />

        {/* Destination dot (optional) */}
        {destinationDistance !== undefined &&
          destinationAngle !== undefined &&
          destinationColor &&
          destinationName && (
            <DestinationDot
              size={size}
              distance={destinationDistance}
              relativeAngle={destinationAngle}
              color={destinationColor}
              spotName={destinationName}
            />
          )}
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
