import { useState, useEffect, useRef } from 'react';
import { Coordinates } from '../types/spot';
import { RadarData } from '../types/radar';
import { useLocation } from './useLocation';
import { useCompass } from './useCompass';
import {
  calculateDistance,
  calculateDistanceVincenty,
  calculateBearing,
  calculateRelativeAngle,
  getProximityZoneWithHysteresis,
  calculateETA,
  calculateProgress,
  ARRIVAL_THRESHOLD,
} from '../utils/geo';

export const useRadar = (
  targetCoords: Coordinates,
  onArrival?: () => void
) => {
  const { location: userLocation, gpsHeading, accuracy, speed } = useLocation();
  const { heading: compassHeading, accuracy: compassAccuracy } = useCompass();
  // Prefer compass (points where phone faces), fall back to GPS heading
  // (direction of travel) when magnetometer is unavailable
  const heading = compassHeading ?? gpsHeading;

  const [radarData, setRadarData] = useState<RadarData>({
    distance: 0,
    relativeAngle: 0,
    proximityZone: 'far',
    userLocation: null,
    heading: null,
    accuracy: null,
    speed: null,
    eta: null,
  });

  // Track initial distance for progress calculation
  const initialDistanceRef = useRef<number | null>(null);

  // Debounced arrival detection (3 seconds sustained)
  const arrivalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const arrivalEntryTimeRef = useRef<number | null>(null);
  const hasTriggeredArrivalRef = useRef(false);
  const onArrivalRef = useRef(onArrival);

  // Update ref when callback changes
  useEffect(() => {
    onArrivalRef.current = onArrival;
  }, [onArrival]);

  useEffect(() => {
    if (!userLocation) {
      return;
    }

    // Use Vincenty formula for more accurate distance (especially over longer distances)
    const distance = calculateDistanceVincenty(userLocation, targetCoords);
    const bearing = calculateBearing(userLocation, targetCoords);
    const relativeAngle = heading !== null
      ? calculateRelativeAngle(bearing, heading)
      : 0;

    // Calculate ETA based on current speed
    const eta = calculateETA(distance, speed);

    // Track initial distance for progress calculation
    if (initialDistanceRef.current === null) {
      initialDistanceRef.current = distance;
    }

    // Calculate journey progress
    const progress = calculateProgress(distance, initialDistanceRef.current);

    setRadarData((prev) => {
      // Calculate proximity zone with hysteresis to prevent flickering
      const proximityZone = getProximityZoneWithHysteresis(distance, prev.proximityZone);

      // Only update if change exceeds GPS noise floor
      const distanceChanged = Math.abs(prev.distance - distance) > 1; // 1m — below GPS accuracy
      // Handle 0/360 wraparound: diff of 359→1 is 2°, not 358°
      const angleDiff = Math.abs(prev.relativeAngle - relativeAngle);
      const angleChanged = Math.min(angleDiff, 360 - angleDiff) > 1;
      const zoneChanged = prev.proximityZone !== proximityZone;
      const accuracyChanged = prev.accuracy !== accuracy;
      const speedChanged = prev.speed !== speed;

      if (distanceChanged || angleChanged || zoneChanged || accuracyChanged || speedChanged || !prev.userLocation) {
        return {
          distance,
          relativeAngle,
          proximityZone,
          userLocation,
          heading,
          accuracy,
          speed,
          eta,
          progress,
        };
      }
      return prev;
    });

    // Arrival detection with sustained 3-second check
    if (distance < ARRIVAL_THRESHOLD && !hasTriggeredArrivalRef.current) {
      // Track when user first entered the threshold
      if (!arrivalEntryTimeRef.current) {
        arrivalEntryTimeRef.current = Date.now();
      }

      // Check if user has been in threshold for 3 sustained seconds
      const timeInThreshold = Date.now() - arrivalEntryTimeRef.current;
      if (timeInThreshold >= 3000 && !arrivalTimeoutRef.current) {
        // Fire immediately after 3 sustained seconds
        arrivalTimeoutRef.current = setTimeout(() => {
          hasTriggeredArrivalRef.current = true;
          onArrivalRef.current?.();
        }, 0);
      }
    } else if (distance >= ARRIVAL_THRESHOLD) {
      // Reset timer if user moves away
      arrivalEntryTimeRef.current = null;
      if (arrivalTimeoutRef.current) {
        clearTimeout(arrivalTimeoutRef.current);
        arrivalTimeoutRef.current = null;
      }
    }
  }, [userLocation, heading, targetCoords, accuracy, speed]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (arrivalTimeoutRef.current) {
        clearTimeout(arrivalTimeoutRef.current);
      }
    };
  }, []);

  return radarData;
};
