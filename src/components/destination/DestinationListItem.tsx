import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Spot } from '../../types/spot';
import { StatusBadge } from './StatusBadge';
import { theme } from '../../constants/theme';

interface DestinationListItemProps {
  spot: Spot;
  isVisited: boolean;
  isSelected: boolean;
  onPress: () => void;
}

export const DestinationListItem: React.FC<DestinationListItemProps> = ({
  spot,
  isVisited,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.icon, { backgroundColor: spot.color }]}>
          <Text style={styles.iconText}>{spot.nameJa[0]}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nameJa}>{spot.nameJa}</Text>
          <Text style={styles.nameEn}>{spot.nameEn}</Text>
        </View>
      </View>
      <StatusBadge isVisited={isVisited} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: theme.colors.accent.cyan,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  iconText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  nameJa: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  nameEn: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
