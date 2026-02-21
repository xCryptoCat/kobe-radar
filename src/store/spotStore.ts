import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spot, VisitedSpotRecord } from '../types/spot';

interface SpotStore {
  visitedSpots: Record<string, VisitedSpotRecord>;
  currentDestination: Spot | null;
  markVisited: (spotId: string) => void;
  setCurrentDestination: (spot: Spot | null) => void;
  isVisited: (spotId: string) => boolean;
  getVisitedCount: () => number;
  clearAllVisited: () => void;
  savePhoto: (spotId: string, photoUri: string) => void;
  getPhotoUri: (spotId: string) => string | undefined;
}

export const useSpotStore = create<SpotStore>()(
  persist(
    (set, get) => ({
      visitedSpots: {},
      currentDestination: null,

      markVisited: (spotId: string) => {
        set((state) => ({
          visitedSpots: {
            ...state.visitedSpots,
            [spotId]: {
              spotId,
              visitedAt: Date.now(),
            },
          },
        }));
      },

      setCurrentDestination: (spot: Spot | null) => {
        set({ currentDestination: spot });
      },

      isVisited: (spotId: string) => {
        return !!get().visitedSpots[spotId];
      },

      getVisitedCount: () => {
        return Object.keys(get().visitedSpots).length;
      },

      clearAllVisited: () => {
        set({ visitedSpots: {} });
      },

      savePhoto: (spotId: string, photoUri: string) => {
        set((state) => {
          const existing = state.visitedSpots[spotId];
          if (!existing) return state;
          return {
            visitedSpots: {
              ...state.visitedSpots,
              [spotId]: { ...existing, photoUri },
            },
          };
        });
      },

      getPhotoUri: (spotId: string) => {
        return get().visitedSpots[spotId]?.photoUri;
      },
    }),
    {
      name: 'kobe-radar-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
