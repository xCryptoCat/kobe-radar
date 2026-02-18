import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { Spot } from './spot';

// Nested stack types (must be defined before TabParamList)
export type DestinationsStackParamList = {
  DestinationSelect: undefined;
  RadarNavigation: { spot: Spot };
  ArrivalCelebration: { spot: Spot };
};

export type StampsStackParamList = {
  StampCard: undefined;
};

// Root tab navigation
export type TabParamList = {
  DestinationsTab: NavigatorScreenParams<DestinationsStackParamList>;
  StampsTab: NavigatorScreenParams<StampsStackParamList>;
};

// Legacy type for compatibility (can be removed after migration)
export type RootStackParamList = {
  DestinationSelect: undefined;
  RadarNavigation: { spot: Spot };
  ArrivalCelebration: { spot: Spot };
  StampCard: undefined;
};

// Update screen props to use CompositeScreenProps for nested navigation
export type DestinationSelectScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DestinationsStackParamList, 'DestinationSelect'>,
  BottomTabScreenProps<TabParamList>
>;

export type RadarNavigationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DestinationsStackParamList, 'RadarNavigation'>,
  BottomTabScreenProps<TabParamList>
>;

export type ArrivalCelebrationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DestinationsStackParamList, 'ArrivalCelebration'>,
  BottomTabScreenProps<TabParamList>
>;

export type StampCardScreenProps = CompositeScreenProps<
  NativeStackScreenProps<StampsStackParamList, 'StampCard'>,
  BottomTabScreenProps<TabParamList>
>;
