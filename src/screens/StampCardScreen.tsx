import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '../components/common/SafeAreaWrapper';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BannerAdWrapper } from '../components/common/BannerAdWrapper';
import { StampGrid } from '../components/stamp/StampGrid';
import { StampCardScreenProps } from '../types/navigation';
import { useSpotStore } from '../store/spotStore';
import { KOBE_SPOTS } from '../data/spots';
import { theme } from '../constants/theme';

export const StampCardScreen: React.FC<StampCardScreenProps> = ({
  navigation,
}) => {
  const { getVisitedCount, visitedSpots } = useSpotStore();
  const visitedCount = getVisitedCount();
  const visitedSpotIds = Object.keys(visitedSpots);

  return (
    <SafeAreaWrapper>
      <ScreenHeader
        title={`${visitedCount}/10 スポット獲得`}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <StampGrid spots={KOBE_SPOTS} visitedSpotIds={visitedSpotIds} />
      </View>
      <BannerAdWrapper />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
});
