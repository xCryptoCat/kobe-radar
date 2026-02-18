import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StampIcon } from './StampIcon';
import { Spot } from '../../types/spot';
import { theme } from '../../constants/theme';

interface StampGridProps {
  spots: Spot[];
  visitedSpotIds: string[];
}

export const StampGrid: React.FC<StampGridProps> = ({
  spots,
  visitedSpotIds,
}) => {
  const isVisited = (spotId: string) => visitedSpotIds.includes(spotId);

  return (
    <View style={styles.container}>
      {spots.map((spot) => (
        <View key={spot.id} style={styles.stampWrapper}>
          <StampIcon spot={spot} isVisited={isVisited(spot.id)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  stampWrapper: {
    width: '18%', // 5 columns with spacing
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
});
