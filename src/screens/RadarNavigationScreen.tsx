import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '../components/common/SafeAreaWrapper';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ActionButton } from '../components/common/ActionButton';
import { BannerAdWrapper } from '../components/common/BannerAdWrapper';
import { RadarContainer } from '../components/radar/RadarContainer';
import { GPSAccuracyIndicator } from '../components/radar/GPSAccuracyIndicator';
import { NavigationStats } from '../components/radar/NavigationStats';
import { RadarNavigationScreenProps } from '../types/navigation';
import { useRadar } from '../hooks/useRadar';
import { formatDistance, formatCoordinates } from '../utils/format';
import { proximityHaptics } from '../utils/haptics';
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

  // Trigger haptic feedback on proximity zone changes
  const previousZoneRef = useRef(radarData.proximityZone);
  useEffect(() => {
    if (previousZoneRef.current !== radarData.proximityZone) {
      proximityHaptics.onZoneChange(radarData.proximityZone);
      previousZoneRef.current = radarData.proximityZone;
    }
  }, [radarData.proximityZone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      proximityHaptics.reset();
    };
  }, []);

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaWrapper>
      <ScreenHeader title={`${spot.nameJa}探索中`} />
      <View style={styles.container}>
        <View style={styles.coordinateBar}>
          <View style={styles.topRow}>
            {radarData.userLocation ? (
              <>
                <Text style={styles.coordinateText}>
                  {formatCoordinates(
                    radarData.userLocation.latitude,
                    radarData.userLocation.longitude
                  )}
                </Text>
                <GPSAccuracyIndicator
                  accuracy={radarData.accuracy}
                  speed={radarData.speed}
                />
              </>
            ) : (
              <Text style={styles.coordinateText}>位置情報を取得中...</Text>
            )}
          </View>
          {radarData.userLocation && (
            <NavigationStats
              eta={radarData.eta}
              progress={radarData.progress}
              distance={radarData.distance}
            />
          )}
        </View>
        <View style={styles.radarContainer}>
          <RadarContainer
            proximityZone={radarData.proximityZone}
            size={300}
            destinationDistance={radarData.distance}
            destinationAngle={radarData.relativeAngle}
            destinationColor={theme.colors.accent.cyan}
            destinationName={spot.nameJa}
            heading={radarData.heading ?? undefined}
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
    gap: theme.spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coordinateText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
    flex: 1,
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
