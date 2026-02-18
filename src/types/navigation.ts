import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Spot } from './spot';

export type RootStackParamList = {
  DestinationSelect: undefined;
  RadarNavigation: { spot: Spot };
  ArrivalCelebration: { spot: Spot };
  StampCard: undefined;
};

export type DestinationSelectScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DestinationSelect'
>;
export type RadarNavigationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RadarNavigation'
>;
export type ArrivalCelebrationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ArrivalCelebration'
>;
export type StampCardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'StampCard'
>;
