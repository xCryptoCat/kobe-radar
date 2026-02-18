/**
 * Calculates the radar position (radius in pixels) for a given real-world distance.
 * Uses square-root scaling so close distances get more visual space — the dot moves
 * faster as you approach the destination, giving strong navigational feedback.
 *
 * Distribution (300px radar, maxRadius=150, effectiveRadius=138):
 *   100m → 14% radius (20px)   — arrived zone, near center
 *   500m → 32% radius (43px)   — inside inner half
 *   1000m → 45% radius (62px)  — around 2nd ring
 *   2000m → 63% radius (87px)  — around 3rd ring
 *   5000m → 100% radius (138px) — at the edge
 *
 * @param distanceMeters - Real-world distance in meters
 * @param maxRadius - Maximum radar radius in pixels (typically 150px for 300px radar)
 * @returns Scaled radius in pixels (0 to maxRadius - DOT_PADDING)
 */
export const calculateRadarPosition = (
  distanceMeters: number,
  maxRadius: number
): number => {
  // Keep dot from clipping outside the radar circle
  const DOT_PADDING = 12;
  const effectiveRadius = maxRadius - DOT_PADDING;

  if (distanceMeters <= 0) return 0;

  // Maximum distance the radar represents — beyond this, dot stays at the edge.
  // Must cover actual Kobe spot distances (Nunobiki Falls→Suma Beach ≈ 9.5km).
  const MAX_DISTANCE = 5000;
  const clamped = Math.min(distanceMeters, MAX_DISTANCE);

  // Square-root scaling: position = sqrt(distance / max)
  // This gives close distances proportionally more visual space.
  const normalized = Math.sqrt(clamped / MAX_DISTANCE);

  return normalized * effectiveRadius;
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
  const normalizedAngle = ((angleDegrees % 360) + 360) % 360;
  const angleRadians = (normalizedAngle * Math.PI) / 180;

  // SVG: X increases right (sin), Y increases down (subtract cos for 0° = up)
  return {
    x: center + radius * Math.sin(angleRadians),
    y: center - radius * Math.cos(angleRadians),
  };
};
