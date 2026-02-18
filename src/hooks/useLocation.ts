import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import { Coordinates } from '../types/spot';

export const useLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [gpsHeading, setGpsHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    Location.PermissionStatus | null
  >(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermissionStatus(status);

        if (status !== Location.PermissionStatus.GRANTED) {
          setError('Location permission denied');
          setPermissionDenied(true);
          return;
        }

        setPermissionDenied(false);

        // Watch position — time-based only so updates arrive even when stationary.
        // On Android, setting both timeInterval AND distanceInterval requires BOTH
        // to be satisfied (AND logic), which blocks arrival detection when the user
        // stops walking. Omitting distanceInterval ensures time-based updates always fire.
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000, // 1 update per second
            mayShowUserSettingsDialog: true,
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            });
            // GPS-derived heading (direction of travel, -1 when unavailable)
            const h = newLocation.coords.heading;
            setGpsHeading(h != null && h >= 0 ? h : null);
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
  }, [retryCount]); // Re-run when retryCount changes

  // Re-check permission when app returns from background
  useEffect(() => {
    if (!permissionDenied) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Re-request permission when app becomes active
        Location.requestForegroundPermissionsAsync().then(({ status }) => {
          if (status === Location.PermissionStatus.GRANTED) {
            setPermissionDenied(false);
            // Trigger re-mount of main effect
            setRetryCount((prev) => prev + 1);
          }
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, [permissionDenied]);

  return { location, gpsHeading, error, permissionStatus };
};
