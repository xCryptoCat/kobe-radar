/**
 * Comprehensive Functionality Tests for Kobe Radar App
 * Tests geo calculations, radar positioning, and edge cases
 */

import {
  calculateDistance,
  calculateBearing,
  calculateRelativeAngle,
  getProximityZone,
  ARRIVAL_THRESHOLD,
} from '../utils/geo';
import { calculateRadarPosition, polarToCartesian } from '../utils/radarPosition';
import { Coordinates } from '../types/spot';

describe('Geo Utility Functions', () => {
  // Known Kobe coordinates from spots.ts
  const meriken = { latitude: 34.6861, longitude: 135.1874 }; // Meriken Park
  const nankinmachi = { latitude: 34.6906, longitude: 135.1929 }; // Nankinmachi
  const kitano = { latitude: 34.6950, longitude: 135.1889 }; // Kitano Ijinkan

  describe('calculateDistance', () => {
    test('should calculate correct distance between Meriken and Nankinmachi', () => {
      const distance = calculateDistance(meriken, nankinmachi);
      // Expected ~709m based on real coordinates
      expect(distance).toBeGreaterThan(700);
      expect(distance).toBeLessThan(720);
    });

    test('should return 0 for same coordinates', () => {
      const distance = calculateDistance(meriken, meriken);
      expect(distance).toBe(0);
    });

    test('should handle coordinates across equator', () => {
      const north = { latitude: 10, longitude: 0 };
      const south = { latitude: -10, longitude: 0 };
      const distance = calculateDistance(north, south);
      expect(distance).toBeGreaterThan(2200000); // ~2,222 km
      expect(distance).toBeLessThan(2250000);
    });

    test('should handle coordinates across prime meridian', () => {
      const east = { latitude: 0, longitude: 10 };
      const west = { latitude: 0, longitude: -10 };
      const distance = calculateDistance(east, west);
      expect(distance).toBeGreaterThan(2200000); // ~2,222 km
      expect(distance).toBeLessThan(2250000);
    });

    test('should handle very small distances (edge case)', () => {
      const coord1 = { latitude: 34.6861, longitude: 135.1874 };
      const coord2 = { latitude: 34.6862, longitude: 135.1875 };
      const distance = calculateDistance(coord1, coord2);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(200); // Should be ~140m
    });
  });

  describe('calculateBearing', () => {
    test('should calculate bearing from Meriken to Kitano (roughly north)', () => {
      const bearing = calculateBearing(meriken, kitano);
      // Kitano is roughly north-northeast of Meriken
      expect(bearing).toBeGreaterThan(0);
      expect(bearing).toBeLessThan(30);
    });

    test('should return 0 for north direction', () => {
      const from = { latitude: 0, longitude: 0 };
      const to = { latitude: 10, longitude: 0 };
      const bearing = calculateBearing(from, to);
      expect(bearing).toBeCloseTo(0, 0);
    });

    test('should return 90 for east direction', () => {
      const from = { latitude: 0, longitude: 0 };
      const to = { latitude: 0, longitude: 10 };
      const bearing = calculateBearing(from, to);
      expect(bearing).toBeCloseTo(90, 0);
    });

    test('should return 180 for south direction', () => {
      const from = { latitude: 10, longitude: 0 };
      const to = { latitude: 0, longitude: 0 };
      const bearing = calculateBearing(from, to);
      expect(bearing).toBeCloseTo(180, 0);
    });

    test('should return 270 for west direction', () => {
      const from = { latitude: 0, longitude: 10 };
      const to = { latitude: 0, longitude: 0 };
      const bearing = calculateBearing(from, to);
      expect(bearing).toBeCloseTo(270, 0);
    });

    test('should normalize negative bearings to 0-360 range', () => {
      const from = { latitude: 0, longitude: 0 };
      const to = { latitude: -1, longitude: -1 };
      const bearing = calculateBearing(from, to);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
    });
  });

  describe('calculateRelativeAngle', () => {
    test('should return 0 when heading equals bearing', () => {
      expect(calculateRelativeAngle(45, 45)).toBe(0);
      expect(calculateRelativeAngle(180, 180)).toBe(0);
      expect(calculateRelativeAngle(270, 270)).toBe(0);
    });

    test('should calculate correct relative angle when bearing > heading', () => {
      expect(calculateRelativeAngle(90, 0)).toBe(90); // Turn 90° right
      expect(calculateRelativeAngle(180, 0)).toBe(180); // Turn 180° (behind)
    });

    test('should calculate correct relative angle when heading > bearing', () => {
      expect(calculateRelativeAngle(0, 90)).toBe(270); // Turn 270° (or -90°)
      expect(calculateRelativeAngle(0, 180)).toBe(180); // Turn 180° (behind)
    });

    test('should handle wrap-around at 360/0 boundary', () => {
      expect(calculateRelativeAngle(10, 350)).toBe(20); // Cross 0° boundary
      expect(calculateRelativeAngle(350, 10)).toBe(340); // Cross 0° boundary reverse
    });

    test('should always return value in 0-360 range', () => {
      for (let bearing = 0; bearing < 360; bearing += 30) {
        for (let heading = 0; heading < 360; heading += 30) {
          const angle = calculateRelativeAngle(bearing, heading);
          expect(angle).toBeGreaterThanOrEqual(0);
          expect(angle).toBeLessThan(360);
        }
      }
    });
  });

  describe('getProximityZone', () => {
    test('should return "arrived" for distances < 100m', () => {
      expect(getProximityZone(0)).toBe('arrived');
      expect(getProximityZone(50)).toBe('arrived');
      expect(getProximityZone(99)).toBe('arrived');
    });

    test('should return "near" for distances 100-199m', () => {
      expect(getProximityZone(100)).toBe('near');
      expect(getProximityZone(150)).toBe('near');
      expect(getProximityZone(199)).toBe('near');
    });

    test('should return "medium" for distances 200-499m', () => {
      expect(getProximityZone(200)).toBe('medium');
      expect(getProximityZone(350)).toBe('medium');
      expect(getProximityZone(499)).toBe('medium');
    });

    test('should return "far" for distances >= 500m', () => {
      expect(getProximityZone(500)).toBe('far');
      expect(getProximityZone(1000)).toBe('far');
      expect(getProximityZone(10000)).toBe('far');
    });

    test('should handle boundary values correctly', () => {
      expect(getProximityZone(99.9)).toBe('arrived');
      expect(getProximityZone(100)).toBe('near');
      expect(getProximityZone(199.9)).toBe('near');
      expect(getProximityZone(200)).toBe('medium');
      expect(getProximityZone(499.9)).toBe('medium');
      expect(getProximityZone(500)).toBe('far');
    });
  });

  describe('ARRIVAL_THRESHOLD constant', () => {
    test('should be 100 meters', () => {
      expect(ARRIVAL_THRESHOLD).toBe(100);
    });
  });
});

describe('Radar Position Calculations', () => {
  const maxRadius = 150; // Standard 300px radar = 150px radius

  describe('calculateRadarPosition', () => {
    test('should return 0 for 0 meters distance', () => {
      expect(calculateRadarPosition(0, maxRadius)).toBe(0);
    });

    test('should map 0-100m to 0-50% of radius (Zone 1)', () => {
      expect(calculateRadarPosition(0, maxRadius)).toBe(0);
      expect(calculateRadarPosition(50, maxRadius)).toBe(37.5); // 25% of radius
      expect(calculateRadarPosition(100, maxRadius)).toBe(75); // 50% of radius
    });

    test('should map 100-500m to 50-80% of radius (Zone 2)', () => {
      expect(calculateRadarPosition(100, maxRadius)).toBe(75); // 50%
      expect(calculateRadarPosition(300, maxRadius)).toBe(97.5); // 65%
      expect(calculateRadarPosition(500, maxRadius)).toBe(120); // 80%
    });

    test('should map 500-2000m to 80-100% of radius (Zone 3)', () => {
      expect(calculateRadarPosition(500, maxRadius)).toBe(120); // 80%
      expect(calculateRadarPosition(1250, maxRadius)).toBe(135); // 90%
      expect(calculateRadarPosition(2000, maxRadius)).toBe(150); // 100%
    });

    test('should clamp distances > 2000m at edge (Zone 4)', () => {
      expect(calculateRadarPosition(2001, maxRadius)).toBe(maxRadius);
      expect(calculateRadarPosition(5000, maxRadius)).toBe(maxRadius);
      expect(calculateRadarPosition(100000, maxRadius)).toBe(maxRadius);
    });

    test('should scale proportionally with different max radius', () => {
      const smallRadius = 100;
      const largeRadius = 200;

      const dist = 100;
      const smallResult = calculateRadarPosition(dist, smallRadius);
      const largeResult = calculateRadarPosition(dist, largeRadius);

      // Should maintain same proportion
      expect(largeResult / largeRadius).toBeCloseTo(
        smallResult / smallRadius,
        2
      );
    });

    test('should handle very small distances precisely', () => {
      const position = calculateRadarPosition(1, maxRadius);
      expect(position).toBeGreaterThan(0);
      expect(position).toBeLessThan(1);
    });
  });

  describe('polarToCartesian', () => {
    const center = 150; // Center of 300px radar

    test('should return center point for radius 0', () => {
      const result = polarToCartesian(center, 0, 0);
      expect(result.x).toBeCloseTo(center, 5);
      expect(result.y).toBeCloseTo(center, 5);
    });

    test('should point north (up) for 0 degrees', () => {
      const result = polarToCartesian(center, 50, 0);
      expect(result.x).toBeCloseTo(center, 5); // No horizontal movement
      expect(result.y).toBeCloseTo(center - 50, 5); // Move up (y decreases)
    });

    test('should point east (right) for 90 degrees', () => {
      const result = polarToCartesian(center, 50, 90);
      expect(result.x).toBeCloseTo(center + 50, 5); // Move right (x increases)
      expect(result.y).toBeCloseTo(center, 5); // No vertical movement
    });

    test('should point south (down) for 180 degrees', () => {
      const result = polarToCartesian(center, 50, 180);
      expect(result.x).toBeCloseTo(center, 5); // No horizontal movement
      expect(result.y).toBeCloseTo(center + 50, 5); // Move down (y increases)
    });

    test('should point west (left) for 270 degrees', () => {
      const result = polarToCartesian(center, 50, 270);
      expect(result.x).toBeCloseTo(center - 50, 5); // Move left (x decreases)
      expect(result.y).toBeCloseTo(center, 5); // No vertical movement
    });

    test('should handle 45-degree angles correctly', () => {
      const result = polarToCartesian(center, 100, 45);
      const offset = 100 / Math.sqrt(2); // ~70.71
      expect(result.x).toBeCloseTo(center + offset, 1); // Northeast
      expect(result.y).toBeCloseTo(center - offset, 1);
    });

    test('should handle full circle (360 degrees)', () => {
      const result0 = polarToCartesian(center, 50, 0);
      const result360 = polarToCartesian(center, 50, 360);
      expect(result360.x).toBeCloseTo(result0.x, 5);
      expect(result360.y).toBeCloseTo(result0.y, 5);
    });

    test('should handle negative angles by wrapping', () => {
      const resultPos = polarToCartesian(center, 50, 270);
      const resultNeg = polarToCartesian(center, 50, -90);
      expect(resultNeg.x).toBeCloseTo(resultPos.x, 5);
      expect(resultNeg.y).toBeCloseTo(resultPos.y, 5);
    });

    test('should work with different center points', () => {
      const result1 = polarToCartesian(100, 50, 0);
      const result2 = polarToCartesian(200, 50, 0);
      expect(result2.x - result1.x).toBeCloseTo(100, 5);
      expect(result2.y - result1.y).toBeCloseTo(100, 5);
    });
  });
});

describe('Edge Cases and Boundary Tests', () => {
  describe('Extreme coordinate values', () => {
    test('should handle North Pole coordinates', () => {
      const northPole = { latitude: 90, longitude: 0 };
      const nearby = { latitude: 89, longitude: 0 };
      const distance = calculateDistance(northPole, nearby);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(200000); // ~111 km
    });

    test('should handle South Pole coordinates', () => {
      const southPole = { latitude: -90, longitude: 0 };
      const nearby = { latitude: -89, longitude: 0 };
      const distance = calculateDistance(southPole, nearby);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(200000);
    });

    test('should handle 180/-180 longitude boundary', () => {
      const east = { latitude: 0, longitude: 179 };
      const west = { latitude: 0, longitude: -179 };
      const distance = calculateDistance(east, west);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(250000); // ~222 km (2 degrees at equator)
    });
  });

  describe('Floating point precision', () => {
    test('should handle very precise coordinates', () => {
      const coord1 = { latitude: 34.123456789, longitude: 135.123456789 };
      const coord2 = { latitude: 34.123456790, longitude: 135.123456790 };
      const distance = calculateDistance(coord1, coord2);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(1); // Very small distance
    });

    test('should handle angle wrapping precision', () => {
      expect(calculateRelativeAngle(359.9, 0.1)).toBeCloseTo(359.8, 1);
      expect(calculateRelativeAngle(0.1, 359.9)).toBeCloseTo(0.2, 1);
    });
  });

  describe('Zero and negative values', () => {
    test('should handle zero distance in radar position', () => {
      expect(calculateRadarPosition(0, 150)).toBe(0);
    });

    test('should handle negative radius gracefully', () => {
      const result = calculateRadarPosition(100, -150);
      // Should still calculate, but result will be negative
      expect(result).toBeLessThan(0);
    });
  });

  describe('Integration tests', () => {
    test('complete navigation flow: calculate all values', () => {
      const userLocation = { latitude: 34.6861, longitude: 135.1874 }; // Meriken
      const destination = { latitude: 34.6906, longitude: 135.1929 }; // Nankinmachi
      const userHeading = 45; // User facing northeast

      const distance = calculateDistance(userLocation, destination);
      const bearing = calculateBearing(userLocation, destination);
      const relativeAngle = calculateRelativeAngle(bearing, userHeading);
      const zone = getProximityZone(distance);
      const radarRadius = calculateRadarPosition(distance, 150);
      const position = polarToCartesian(150, radarRadius, relativeAngle);

      // All values should be valid
      expect(distance).toBeGreaterThan(0);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
      expect(relativeAngle).toBeGreaterThanOrEqual(0);
      expect(relativeAngle).toBeLessThan(360);
      expect(['arrived', 'near', 'medium', 'far']).toContain(zone);
      expect(radarRadius).toBeGreaterThanOrEqual(0);
      expect(radarRadius).toBeLessThanOrEqual(150);
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.x).toBeLessThanOrEqual(300);
      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeLessThanOrEqual(300);
    });

    test('arrival detection: within threshold', () => {
      const userLocation = { latitude: 34.6861, longitude: 135.1874 };
      const destination = { latitude: 34.6862, longitude: 135.1875 };

      const distance = calculateDistance(userLocation, destination);
      const zone = getProximityZone(distance);

      expect(distance).toBeLessThan(ARRIVAL_THRESHOLD);
      expect(zone).toBe('arrived');
    });

    test('arrival detection: just outside threshold', () => {
      const userLocation = { latitude: 34.6861, longitude: 135.1874 };
      // Calculate a point ~101m away
      const destination = { latitude: 34.6870, longitude: 135.1874 };

      const distance = calculateDistance(userLocation, destination);
      const zone = getProximityZone(distance);

      expect(distance).toBeGreaterThan(ARRIVAL_THRESHOLD);
      expect(zone).not.toBe('arrived');
    });
  });
});

describe('Performance and Stress Tests', () => {
  test('should handle rapid repeated calculations', () => {
    const coord1 = { latitude: 34.6861, longitude: 135.1874 };
    const coord2 = { latitude: 34.6906, longitude: 135.1929 };

    const startTime = Date.now();
    for (let i = 0; i < 1000; i++) {
      calculateDistance(coord1, coord2);
      calculateBearing(coord1, coord2);
      calculateRelativeAngle(45, 90);
    }
    const endTime = Date.now();

    // Should complete 3000 calculations in reasonable time (< 100ms)
    expect(endTime - startTime).toBeLessThan(100);
  });

  test('should handle all angle combinations', () => {
    for (let bearing = 0; bearing < 360; bearing += 15) {
      for (let heading = 0; heading < 360; heading += 15) {
        const relativeAngle = calculateRelativeAngle(bearing, heading);
        expect(relativeAngle).toBeGreaterThanOrEqual(0);
        expect(relativeAngle).toBeLessThan(360);
      }
    }
  });
});

console.log('✅ All tests defined and ready to run');
