import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { CircularEMA } from '../utils/smoothing';

/**
 * Compass hook using the OS heading API (Location.watchHeadingAsync).
 *
 * This is fundamentally more accurate than raw magnetometer atan2 because
 * the OS fuses magnetometer + accelerometer + gyroscope data to produce
 * a tilt-compensated, sensor-fused heading. Raw magnetometer heading drifts
 * 20-40° when the phone isn't perfectly flat.
 *
 * Returns trueHeading (corrected for magnetic declination) when available,
 * otherwise falls back to magHeading (magnetic north).
 *
 * Enhanced with circular EMA smoothing to reduce compass jitter while
 * maintaining responsiveness to actual rotation.
 */
export const useCompass = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Circular EMA filter for smooth heading (handles 0°/360° wraparound)
  const smoothingRef = useRef<CircularEMA>(new CircularEMA(0.15));

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startCompass = async () => {
      try {
        subscription = await Location.watchHeadingAsync((headingData) => {
          // trueHeading: relative to true north (accounts for magnetic declination)
          // magHeading: relative to magnetic north
          // trueHeading is -1 when unavailable (no GPS fix yet for declination)
          const rawHeading = headingData.trueHeading >= 0
            ? headingData.trueHeading
            : headingData.magHeading;

          // Apply circular smoothing to reduce compass jitter
          const smoothedHeading = smoothingRef.current.update(rawHeading);

          setHeading(smoothedHeading);
          setAccuracy(headingData.accuracy);
          setError(null);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    startCompass();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { heading, error, accuracy };
};
