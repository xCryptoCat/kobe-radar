import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface GPSAccuracyIndicatorProps {
  accuracy: number | null; // GPS accuracy in meters
  speed: number | null; // Speed in meters per second
}

/**
 * Get signal quality rating based on GPS accuracy
 */
const getSignalQuality = (
  accuracy: number | null
): { level: 'excellent' | 'good' | 'fair' | 'poor'; color: string; label: string } => {
  if (accuracy === null) {
    return { level: 'poor', color: theme.colors.text.muted, label: '待機中' };
  }

  if (accuracy <= 5) {
    return { level: 'excellent', color: theme.colors.status.visited, label: '優秀' };
  } else if (accuracy <= 10) {
    return { level: 'good', color: theme.colors.accent.cyan, label: '良好' };
  } else if (accuracy <= 20) {
    return { level: 'fair', color: theme.colors.accent.yellow, label: '普通' };
  } else {
    return { level: 'poor', color: theme.colors.status.unvisited, label: '低' };
  }
};

export const GPSAccuracyIndicator: React.FC<GPSAccuracyIndicatorProps> = ({
  accuracy,
  speed,
}) => {
  const signal = getSignalQuality(accuracy);

  return (
    <View style={styles.container}>
      {/* Signal quality bars */}
      <View style={styles.barsContainer}>
        {[1, 2, 3, 4].map((bar) => (
          <View
            key={bar}
            style={[
              styles.bar,
              {
                height: bar * 3 + 4,
                backgroundColor:
                  signal.level === 'excellent'
                    ? signal.color
                    : signal.level === 'good' && bar <= 3
                    ? signal.color
                    : signal.level === 'fair' && bar <= 2
                    ? signal.color
                    : bar === 1
                    ? signal.color
                    : theme.colors.status.grey,
              },
            ]}
          />
        ))}
      </View>

      {/* Accuracy text */}
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: signal.color }]}>
          GPS: {signal.label}
        </Text>
        {accuracy !== null && (
          <Text style={styles.accuracyValue}>±{Math.round(accuracy)}m</Text>
        )}
        {speed !== null && speed > 0.5 && (
          <Text style={styles.speedValue}>
            {(speed * 3.6).toFixed(1)} km/h
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
  },
  bar: {
    width: 3,
    borderRadius: 1,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
  },
  accuracyValue: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.muted,
  },
  speedValue: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent.teal,
    fontWeight: '500',
  },
});
