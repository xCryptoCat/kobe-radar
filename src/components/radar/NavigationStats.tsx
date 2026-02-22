import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { formatETA } from '../../utils/geo';

interface NavigationStatsProps {
  eta: number | null; // ETA in seconds
  progress: number | undefined; // Progress percentage (0-100)
  distance: number; // Current distance in meters
}

export const NavigationStats: React.FC<NavigationStatsProps> = ({
  eta,
  progress,
  distance,
}) => {
  return (
    <View style={styles.container}>
      {/* Progress bar */}
      {progress !== undefined && progress > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      )}

      {/* ETA and Distance */}
      <View style={styles.statsRow}>
        {eta !== null && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>到着予定</Text>
            <Text style={styles.statValue}>{formatETA(eta)}</Text>
          </View>
        )}

        {distance < 1000 && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>残り</Text>
            <Text style={styles.statValue}>{Math.round(distance)}m</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.status.grey,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.accent.cyan,
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.muted,
  },
  statValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
});
