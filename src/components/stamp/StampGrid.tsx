import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StampIcon } from './StampIcon';
import { Spot, VisitedSpotRecord } from '../../types/spot';
import { theme } from '../../constants/theme';

interface StampGridProps {
  spots: Spot[];
  visitedSpots: Record<string, VisitedSpotRecord>;
  onStampPress?: (spot: Spot, photoUri?: string) => void;
}

export const StampGrid: React.FC<StampGridProps> = ({
  spots,
  visitedSpots,
  onStampPress,
}) => {
  const isVisited = (spotId: string) => !!visitedSpots[spotId];
  const hasPhoto = (spotId: string) => !!visitedSpots[spotId]?.photoUri;
  const getPhotoUri = (spotId: string) => visitedSpots[spotId]?.photoUri;

  return (
    <View style={styles.container}>
      {spots.map((spot) => (
        <View key={spot.id} style={styles.stampWrapper}>
          <StampIcon
            spot={spot}
            isVisited={isVisited(spot.id)}
            hasPhoto={hasPhoto(spot.id)}
            onPress={
              hasPhoto(spot.id) && onStampPress
                ? () => onStampPress(spot, getPhotoUri(spot.id))
                : undefined
            }
          />
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
