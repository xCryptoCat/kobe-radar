import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaWrapper } from '../components/common/SafeAreaWrapper';
import { ActionButton } from '../components/common/ActionButton';
import { RadarContainer } from '../components/radar/RadarContainer';
import { ParticleEffect } from '../components/celebration/ParticleEffect';
import { CompletionOverlay } from '../components/celebration/CompletionOverlay';
import { ArrivalCelebrationScreenProps } from '../types/navigation';
import { useSpotStore } from '../store/spotStore';
import { theme } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export const ArrivalCelebrationScreen: React.FC<
  ArrivalCelebrationScreenProps
> = ({ navigation, route }) => {
  const { spot } = route.params;
  const { markVisited } = useSpotStore();

  useEffect(() => {
    // Mark as visited and trigger haptic feedback
    markVisited(spot.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [spot.id, markVisited]);

  const handleGoToStampCard = () => {
    navigation.navigate('StampsTab', { screen: 'StampCard' });
  };

  const handleTakePhoto = () => {
    Alert.alert('Coming Soon', 'Photo feature will be available in a future update!');
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Static radar backdrop */}
        <View style={styles.backdropContainer}>
          <RadarContainer
            relativeAngle={0}
            proximityZone="arrived"
            size={300}
          />
        </View>

        {/* Particle burst animation */}
        <ParticleEffect />

        {/* Celebration overlay */}
        <View style={styles.overlayContainer}>
          <CompletionOverlay spotName={spot.nameJa} />
          <View style={styles.buttonGroup}>
            <ActionButton
              title="スタンプ台帳へ"
              onPress={handleGoToStampCard}
              variant="primary"
              style={styles.button}
            />
            <ActionButton
              title="記念フォトを撮る"
              onPress={handleTakePhoto}
              variant="secondary"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backdropContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.15,
  },
  overlayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  buttonGroup: {
    width: '100%',
    gap: theme.spacing.md,
  },
  button: {
    width: '100%',
  },
});
