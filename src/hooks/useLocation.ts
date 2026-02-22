import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import { Coordinates } from '../types/spot';
import { CoordinateKalmanFilter } from '../utils/kalman';

export const useLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [gpsHeading, setGpsHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    Location.PermissionStatus | null
  >(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);

  // Kalman filter for GPS smoothing
  const kalmanFilterRef = useRef<CoordinateKalmanFilter | null>(null);

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
            const rawLat = newLocation.coords.latitude;
            const rawLng = newLocation.coords.longitude;
            const gpsAccuracy = newLocation.coords.accuracy ?? undefined;

            // Initialize Kalman filter on first reading
            if (!kalmanFilterRef.current) {
              kalmanFilterRef.current = new CoordinateKalmanFilter(rawLat, rawLng);
            }

            // Apply Kalman filtering for smooth, accurate position
            const filtered = kalmanFilterRef.current.update(
              rawLat,
              rawLng,
              gpsAccuracy
            );

            setLocation({
              latitude: filtered.latitude,
              longitude: filtered.longitude,
            });

            // Store GPS accuracy and speed
            setAccuracy(gpsAccuracy ?? null);
            setSpeed(newLocation.coords.speed ?? null);

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

  return { location, gpsHeading, error, permissionStatus, accuracy, speed };
};
