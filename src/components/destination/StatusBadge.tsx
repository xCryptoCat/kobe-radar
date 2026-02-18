import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface StatusBadgeProps {
  isVisited: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isVisited }) => {
  return (
    <View
      style={[
        styles.badge,
        isVisited ? styles.visitedBadge : styles.unvisitedBadge,
      ]}
    >
      <Text style={styles.badgeText}>
        {isVisited ? '到達済' : '未到達'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  visitedBadge: {
    backgroundColor: theme.colors.status.visited,
  },
  unvisitedBadge: {
    backgroundColor: theme.colors.status.unvisited,
  },
  badgeText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.xs,
    fontWeight: 'bold',
  },
});
