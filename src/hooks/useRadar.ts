import { useState, useEffect, useRef } from 'react';
import { Coordinates } from '../types/spot';
import { RadarData } from '../types/radar';
import { useLocation } from './useLocation';
import { useCompass } from './useCompass';
import {
  calculateDistance,
  calculateBearing,
  calculateRelativeAngle,
  getProximityZone,
  ARRIVAL_THRESHOLD,
} from '../utils/geo';

export const useRadar = (
  targetCoords: Coordinates,
  onArrival?: () => void
) => {
  const { location: userLocation } = useLocation();
  const { heading } = useCompass();
  const [radarData, setRadarData] = useState<RadarData>({
    distance: 0,
    relativeAngle: 0,
    proximityZone: 'far',
    userLocation: null,
    heading: null,
  });

  // Debounced arrival detection (3 seconds sustained)
  const arrivalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

    const distance = calculateDistance(userLocation, targetCoords);
    const bearing = calculateBearing(userLocation, targetCoords);
    const relativeAngle = heading !== null
      ? calculateRelativeAngle(bearing, heading)
      : 0;
    const proximityZone = getProximityZone(distance);

    setRadarData((prev) => {
      // Only update if values changed significantly
      const distanceChanged = Math.abs(prev.distance - distance) > 1;
      const angleChanged = Math.abs(prev.relativeAngle - relativeAngle) > 1;
      const zoneChanged = prev.proximityZone !== proximityZone;

      if (distanceChanged || angleChanged || zoneChanged || !prev.userLocation) {
        return {
          distance,
          relativeAngle,
          proximityZone,
          userLocation,
          heading,
        };
      }
      return prev;
    });

    // Arrival detection with debounce
    if (distance < ARRIVAL_THRESHOLD && !hasTriggeredArrivalRef.current) {
      if (!arrivalTimeoutRef.current) {
        arrivalTimeoutRef.current = setTimeout(() => {
          hasTriggeredArrivalRef.current = true;
          onArrivalRef.current?.();
        }, 3000);
      }
    } else if (distance >= ARRIVAL_THRESHOLD) {
      // Reset if user moves away
      if (arrivalTimeoutRef.current) {
        clearTimeout(arrivalTimeoutRef.current);
        arrivalTimeoutRef.current = null;
      }
    }
  }, [userLocation, heading, targetCoords]);

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
