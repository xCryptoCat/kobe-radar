/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted string (e.g., "125m" or "1.2km")
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Format coordinates for display
 * @param latitude Latitude value
 * @param longitude Longitude value
 * @returns Formatted string (e.g., "N 34.6843°, E 135.1862°")
 */
export const formatCoordinates = (
  latitude: number,
  longitude: number
): string => {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  return `${latDir} ${Math.abs(latitude).toFixed(4)}°, ${lngDir} ${Math.abs(
    longitude
  ).toFixed(4)}°`;
};

/**
 * Format bearing for display
 * @param degrees Bearing in degrees (0-360)
 * @returns Formatted string with cardinal direction
 */
export const formatBearing = (degrees: number): string => {
  const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return `${Math.round(degrees)}° ${cardinals[index]}`;
};
