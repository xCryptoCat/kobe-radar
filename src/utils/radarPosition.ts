/**
 * Calculates the radar position (radius in pixels) for a given real-world distance.
 * Uses multi-zone adaptive scaling to provide accurate positioning at close range
 * while keeping distant destinations visible at radar edge.
 *
 * @param distanceMeters - Real-world distance in meters
 * @param maxRadius - Maximum radar radius in pixels (typically 150px for 300px radar)
 * @returns Scaled radius in pixels (0 to maxRadius)
 */
export const calculateRadarPosition = (
  distanceMeters: number,
  maxRadius: number
): number => {
  // Multi-zone scaling approach:
  // 0-100m → 0-50% of radius (precise for nearby)
  // 100-500m → 50-80% of radius (good distribution)
  // 500-2000m → 80-100% of radius (compressed but visible)
  // >2000m → clamped at edge (always visible)

  if (distanceMeters <= 100) {
    // Zone 1: 0-100m maps to 0-50% of radius
    return (distanceMeters / 100) * maxRadius * 0.5;
  } else if (distanceMeters <= 500) {
    // Zone 2: 100-500m maps to 50-80% of radius
    const normalizedDistance = (distanceMeters - 100) / 400; // 0-1 range
    return maxRadius * (0.5 + normalizedDistance * 0.3);
  } else if (distanceMeters <= 2000) {
    // Zone 3: 500-2000m maps to 80-100% of radius
    const normalizedDistance = (distanceMeters - 500) / 1500; // 0-1 range
    return maxRadius * (0.8 + normalizedDistance * 0.2);
  } else {
    // Zone 4: >2000m clamped at edge
    return maxRadius;
  }
};

/**
 * Converts polar coordinates (radius, angle) to cartesian coordinates (x, y)
 * for SVG rendering.
 *
 * @param center - Center point of the radar (both x and y, since radar is square)
 * @param radius - Distance from center in pixels
 * @param angleDegrees - Angle in degrees (0° = North/top, 90° = East/right)
 * @returns {x, y} cartesian coordinates for SVG
 */
export const polarToCartesian = (
  center: number,
  radius: number,
  angleDegrees: number
): { x: number; y: number } => {
  // Convert degrees to radians
  const angleRadians = (angleDegrees * Math.PI) / 180;

  // SVG coordinate system:
  // - X increases right (sin is correct)
  // - Y increases down (so we subtract cos to make 0° point up)
  const x = center + radius * Math.sin(angleRadians);
  const y = center - radius * Math.cos(angleRadians);

  return { x, y };
};
