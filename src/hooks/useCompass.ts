import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

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
 */
export const useCompass = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startCompass = async () => {
      try {
        subscription = await Location.watchHeadingAsync((headingData) => {
          // trueHeading: relative to true north (accounts for magnetic declination)
          // magHeading: relative to magnetic north
          // trueHeading is -1 when unavailable (no GPS fix yet for declination)
          const h = headingData.trueHeading >= 0
            ? headingData.trueHeading
            : headingData.magHeading;
          setHeading(h);
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

  return { heading, error };
};
