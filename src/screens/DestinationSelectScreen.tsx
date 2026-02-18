import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaWrapper } from '../components/common/SafeAreaWrapper';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ActionButton } from '../components/common/ActionButton';
import { BannerAdWrapper } from '../components/common/BannerAdWrapper';
import { DestinationListItem } from '../components/destination/DestinationListItem';
import { DestinationSelectScreenProps } from '../types/navigation';
import { KOBE_SPOTS } from '../data/spots';
import { useSpotStore } from '../store/spotStore';
import { theme } from '../constants/theme';
import { Spot } from '../types/spot';

export const DestinationSelectScreen: React.FC<DestinationSelectScreenProps> = ({
  navigation,
}) => {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const { isVisited } = useSpotStore();

  const handleStartExploration = () => {
    if (selectedSpot) {
      useSpotStore.getState().setCurrentDestination(selectedSpot);
      navigation.navigate('RadarNavigation', { spot: selectedSpot });
    }
  };

  const handleStampCardPress = () => {
    navigation.navigate('StampsTab', { screen: 'StampCard' });
  };

  return (
    <SafeAreaWrapper>
      <ScreenHeader
        title="行き先選択"
        rightIcon={
          <View style={styles.stampIcon}>
            <Text style={styles.stampIconText}>🎫</Text>
          </View>
        }
        onRightIconPress={handleStampCardPress}
      />
      <View style={styles.container}>
        <FlatList
          data={KOBE_SPOTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DestinationListItem
              spot={item}
              isVisited={isVisited(item.id)}
              isSelected={selectedSpot?.id === item.id}
              onPress={() => setSelectedSpot(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
        <View style={styles.buttonContainer}>
          <ActionButton
            title="探索をはじめる"
            onPress={handleStartExploration}
            disabled={!selectedSpot}
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
  },
  listContent: {
    padding: theme.spacing.md,
  },
  buttonContainer: {
    padding: theme.spacing.lg,
  },
  stampIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampIconText: {
    fontSize: 24,
  },
});
