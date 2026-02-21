import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Spot } from '../../types/spot';
import { theme } from '../../constants/theme';
import { STAMP_IMAGES } from '../../data/stampImages';

interface StampIconProps {
  spot: Spot;
  isVisited: boolean;
  hasPhoto?: boolean;
  onPress?: () => void;
}

export const StampIcon: React.FC<StampIconProps> = ({
  spot,
  isVisited,
  hasPhoto,
  onPress
}) => {
  const backgroundColor = isVisited ? spot.color : theme.colors.status.grey;

  const content = (
    <View style={[styles.container, { backgroundColor }]}>
      {isVisited ? (
        // Show stamp image when visited
        <Image
          source={STAMP_IMAGES[spot.id as keyof typeof STAMP_IMAGES]}
          style={styles.stampImage}
          resizeMode="contain"
        />
      ) : (
        // Show first character when unvisited (gray state)
        <Text style={[styles.text, { color: theme.colors.status.greyText }]}>
          {spot.nameJa[0]}
        </Text>
      )}

      {isVisited && <View style={styles.visitedIndicator} />}

      {hasPhoto && (
        <View style={styles.photoIndicator}>
          <Text style={styles.photoIcon}>📷</Text>
        </View>
      )}
    </View>
  );

  if (onPress && isVisited) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
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
  stampImage: {
    width: 50,
    height: 50,
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
  photoIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  photoIcon: {
    fontSize: 12,
  },
});