import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '../components/common/SafeAreaWrapper';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BannerAdWrapper } from '../components/common/BannerAdWrapper';
import { StampGrid } from '../components/stamp/StampGrid';
import { PhotoViewerModal } from '../components/stamp/PhotoViewerModal';
import { StampCardScreenProps } from '../types/navigation';
import { useSpotStore } from '../store/spotStore';
import { KOBE_SPOTS } from '../data/spots';
import { Spot } from '../types/spot';
import { theme } from '../constants/theme';

export const StampCardScreen: React.FC<StampCardScreenProps> = ({
  navigation,
}) => {
  const { getVisitedCount, visitedSpots } = useSpotStore();
  const visitedCount = getVisitedCount();

  const [selectedPhoto, setSelectedPhoto] = useState<{
    uri: string;
    spotName: string;
  } | null>(null);

  const handleStampPress = (spot: Spot, photoUri?: string) => {
    if (photoUri) {
      setSelectedPhoto({
        uri: photoUri,
        spotName: spot.nameJa,
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <SafeAreaWrapper>
      <ScreenHeader
        title={`${visitedCount}/10 スポット獲得`}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <StampGrid
          spots={KOBE_SPOTS}
          visitedSpots={visitedSpots}
          onStampPress={handleStampPress}
        />
      </View>
      <BannerAdWrapper />
      <PhotoViewerModal
        visible={!!selectedPhoto}
        photoUri={selectedPhoto?.uri || null}
        spotName={selectedPhoto?.spotName || ''}
        onClose={handleCloseModal}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
});
