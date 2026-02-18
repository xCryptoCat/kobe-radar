import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '../components/common/SafeAreaWrapper';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ActionButton } from '../components/common/ActionButton';
import { BannerAdWrapper } from '../components/common/BannerAdWrapper';
import { RadarContainer } from '../components/radar/RadarContainer';
import { RadarNavigationScreenProps } from '../types/navigation';
import { useRadar } from '../hooks/useRadar';
import { useSpotStore } from '../store/spotStore';
import { formatDistance, formatCoordinates } from '../utils/format';
import { theme } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export const RadarNavigationScreen: React.FC<RadarNavigationScreenProps> = ({
  navigation,
  route,
}) => {
  const { spot } = route.params;

  const handleArrival = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.replace('ArrivalCelebration', { spot });
  };

  const radarData = useRadar(
    { latitude: spot.latitude, longitude: spot.longitude },
    handleArrival
  );

  // Check if destination is visited and determine dot color
  const { isVisited } = useSpotStore();
  const visited = isVisited(spot.id);
  const dotColor = visited ? theme.colors.status.visited : spot.color;

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaWrapper>
      <ScreenHeader title={`${spot.nameJa}探索中`} />
      <View style={styles.container}>
        <View style={styles.coordinateBar}>
          {radarData.userLocation ? (
            <>
              <Text style={styles.coordinateText}>
                {formatCoordinates(
                  radarData.userLocation.latitude,
                  radarData.userLocation.longitude
                )}
              </Text>
              <Text style={styles.distanceSmall}>
                距離: {formatDistance(radarData.distance)}
              </Text>
            </>
          ) : (
            <Text style={styles.coordinateText}>位置情報を取得中...</Text>
          )}
        </View>
        <View style={styles.radarContainer}>
          <RadarContainer
            relativeAngle={radarData.relativeAngle}
            proximityZone={radarData.proximityZone}
            size={300}
            destinationDistance={radarData.distance}
            destinationAngle={radarData.relativeAngle}
            destinationColor={dotColor}
            destinationName={spot.nameJa}
          />
        </View>
        <View style={styles.controlsContainer}>
          <Text style={styles.distanceText}>
            {formatDistance(radarData.distance)}
          </Text>
          <ActionButton
            title="探索を中止"
            onPress={handleCancel}
            variant="danger"
          />
        </View>
      </View>
      <BannerAdWrapper />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  coordinateBar: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
  },
  coordinateText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  distanceSmall: {
    color: theme.colors.text.muted,
    fontSize: theme.fontSize.xs,
  },
  radarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  distanceText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.xxl,
    marginBottom: theme.spacing.md,
    fontWeight: 'bold',
  },
});
