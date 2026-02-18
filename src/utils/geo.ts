import { Coordinates } from '../types/spot';
import { ProximityZone } from '../types/radar';

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 */
const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate great-circle distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 6371000; // Earth's radius in meters
  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  const deltaLat = toRadians(coord2.latitude - coord1.latitude);
  const deltaLng = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Calculate initial bearing from one coordinate to another
 * @returns Bearing in degrees (0-360, 0=North)
 */
export const calculateBearing = (
  from: Coordinates,
  to: Coordinates
): number => {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLng = toRadians(to.longitude - from.longitude);

  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

  const bearing = toDegrees(Math.atan2(y, x));

  // Normalize to 0-360
  return (bearing + 360) % 360;
};

/**
 * Calculate relative angle from user's heading to target
 * This is used to rotate the radar arrow
 * @param bearing Bearing to target (0-360)
 * @param heading User's heading (0-360)
 * @returns Relative angle in degrees (0-360)
 */
export const calculateRelativeAngle = (
  bearing: number,
  heading: number
): number => {
  return (bearing - heading + 360) % 360;
};

/**
 * Determine proximity zone based on distance
 */
export const getProximityZone = (distanceMeters: number): ProximityZone => {
  if (distanceMeters < ARRIVAL_THRESHOLD) return 'arrived';
  if (distanceMeters < 200) return 'near';
  if (distanceMeters < 500) return 'medium';
  return 'far';
};

/**
 * Determine proximity zone with hysteresis to prevent flickering
 * Hysteresis prevents rapid zone changes when distance oscillates near boundaries
 */
export const getProximityZoneWithHysteresis = (
  distanceMeters: number,
  previousZone?: ProximityZone
): ProximityZone => {
  const HYSTERESIS_MARGIN = 10; // 10 meters — matches typical urban GPS drift (±5-15m)

  // Define zone boundaries with hysteresis
  const zones = {
    arrived: { enter: ARRIVAL_THRESHOLD, exit: ARRIVAL_THRESHOLD + HYSTERESIS_MARGIN },
    near: { enter: 200, exit: 200 + HYSTERESIS_MARGIN },
    medium: { enter: 500, exit: 500 + HYSTERESIS_MARGIN },
  };

  // Check if staying in current zone (with hysteresis)
  if (previousZone) {
    switch (previousZone) {
      case 'arrived':
        if (distanceMeters < zones.arrived.exit) return 'arrived';
        break;
      case 'near':
        if (distanceMeters >= zones.arrived.exit && distanceMeters < zones.near.exit) return 'near';
        break;
      case 'medium':
        if (distanceMeters >= zones.near.exit && distanceMeters < zones.medium.exit) return 'medium';
        break;
    }
  }

  // Determine new zone (entering thresholds)
  if (distanceMeters < zones.arrived.enter) return 'arrived';
  if (distanceMeters < zones.near.enter) return 'near';
  if (distanceMeters < zones.medium.enter) return 'medium';
  return 'far';
};

/**
 * Arrival threshold in meters
 * 100m accounts for urban GPS drift in Kobe
 */
export const ARRIVAL_THRESHOLD = 100;
