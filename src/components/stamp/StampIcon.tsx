import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spot } from '../../types/spot';
import { theme } from '../../constants/theme';

interface StampIconProps {
  spot: Spot;
  isVisited: boolean;
}

export const StampIcon: React.FC<StampIconProps> = ({ spot, isVisited }) => {
  const backgroundColor = isVisited ? spot.color : theme.colors.status.grey;
  const textColor = isVisited
    ? theme.colors.text.primary
    : theme.colors.status.greyText;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {spot.nameJa[0]}
      </Text>
      {isVisited && <View style={styles.visitedIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
  },
  visitedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.status.visited,
  },
});
