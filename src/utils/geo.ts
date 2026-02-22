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

/**
 * Calculate more accurate distance using Vincenty formula
 * More precise than Haversine, accounts for Earth's ellipsoid shape
 * @returns Distance in meters
 */
export const calculateDistanceVincenty = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const a = 6378137.0; // WGS-84 semi-major axis (equatorial radius)
  const b = 6356752.314245; // WGS-84 semi-minor axis (polar radius)
  const f = 1 / 298.257223563; // WGS-84 flattening

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  const lon1 = toRadians(coord1.longitude);
  const lon2 = toRadians(coord2.longitude);

  const L = lon2 - lon1;
  const U1 = Math.atan((1 - f) * Math.tan(lat1));
  const U2 = Math.atan((1 - f) * Math.tan(lat2));
  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2);
  const cosU2 = Math.cos(U2);

  let lambda = L;
  let lambdaP = 2 * Math.PI;
  let iterLimit = 100;
  let cosSqAlpha = 0;
  let sinSigma = 0;
  let cos2SigmaM = 0;
  let cosSigma = 0;
  let sigma = 0;

  while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0) {
    const sinLambda = Math.sin(lambda);
    const cosLambda = Math.cos(lambda);
    sinSigma = Math.sqrt(
      cosU2 * sinLambda * (cosU2 * sinLambda) +
        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
          (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
    );
    if (sinSigma === 0) return 0; // Co-incident points
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    const sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
    cosSqAlpha = 1 - sinAlpha * sinAlpha;
    cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;
    if (isNaN(cos2SigmaM)) cos2SigmaM = 0; // Equatorial line
    const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    lambdaP = lambda;
    lambda =
      L +
      (1 - C) *
        f *
        sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  }

  if (iterLimit === 0) {
    // Formula failed to converge, fall back to Haversine
    return calculateDistance(coord1, coord2);
  }

  const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const deltaSigma =
    B *
    sinSigma *
    (cos2SigmaM +
      (B / 4) *
        (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
          (B / 6) *
            cos2SigmaM *
            (-3 + 4 * sinSigma * sinSigma) *
            (-3 + 4 * cos2SigmaM * cos2SigmaM)));

  return b * A * (sigma - deltaSigma);
};

/**
 * Calculate ETA (Estimated Time of Arrival) based on current speed
 * @param distanceMeters Distance to destination in meters
 * @param speedMetersPerSec Current speed in meters per second (from GPS)
 * @returns ETA in seconds, or null if not moving
 */
export const calculateETA = (
  distanceMeters: number,
  speedMetersPerSec: number | null
): number | null => {
  if (!speedMetersPerSec || speedMetersPerSec < 0.5) {
    // Not moving or speed too slow (< 0.5 m/s = 1.8 km/h)
    return null;
  }

  return distanceMeters / speedMetersPerSec;
};

/**
 * Format ETA in human-readable format
 * @param etaSeconds ETA in seconds
 * @returns Formatted string like "5分" or "1時間23分"
 */
export const formatETA = (etaSeconds: number | null): string => {
  if (etaSeconds === null) return '---';

  const minutes = Math.ceil(etaSeconds / 60);

  if (minutes < 60) {
    return `${minutes}分`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }

  return `${hours}時間${remainingMinutes}分`;
};

/**
 * Calculate journey progress percentage
 * @param currentDistance Current distance to destination
 * @param startDistance Initial distance when journey started
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (
  currentDistance: number,
  startDistance: number
): number => {
  if (startDistance <= 0) return 0;

  const traveled = startDistance - currentDistance;
  const progress = (traveled / startDistance) * 100;

  return Math.max(0, Math.min(100, progress));
};
