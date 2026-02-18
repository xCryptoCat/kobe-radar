import { useState, useEffect } from 'react';
import { Magnetometer } from 'expo-sensors';

const ALPHA = 0.15; // Low-pass filter coefficient

/**
 * Convert magnetometer data to heading in degrees
 */
const calculateHeading = (x: number, y: number): number => {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  // Normalize to 0-360
  return (angle + 360) % 360;
};

/**
 * Low-pass filter for smooth heading updates
 */
const applyLowPassFilter = (
  currentValue: number,
  newValue: number,
  alpha: number
): number => {
  // Handle angle wrapping (359 -> 1 should filter to 0, not 180)
  let diff = newValue - currentValue;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  const filtered = currentValue + alpha * diff;
  return (filtered + 360) % 360;
};

export const useCompass = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let filteredHeading: number | null = null;

    const startCompass = async () => {
      try {
        const isAvailable = await Magnetometer.isAvailableAsync();
        if (!isAvailable) {
          setError('Magnetometer not available on this device');
          return;
        }

        Magnetometer.setUpdateInterval(100);

        subscription = Magnetometer.addListener((data) => {
          const rawHeading = calculateHeading(data.x, data.y);

          if (filteredHeading === null) {
            filteredHeading = rawHeading;
          } else {
            filteredHeading = applyLowPassFilter(filteredHeading, rawHeading, ALPHA);
          }

          setHeading(filteredHeading);
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
