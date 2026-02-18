import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Coordinates } from '../types/spot';

export const useLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    Location.PermissionStatus | null
  >(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermissionStatus(status);

        if (status !== Location.PermissionStatus.GRANTED) {
          setError('Location permission denied');
          return;
        }

        // Start watching position
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 5,
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            });
            setError(null);
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { location, error, permissionStatus };
};
