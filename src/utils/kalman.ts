/**
 * Simple Kalman Filter for GPS coordinate smoothing
 * Reduces GPS noise while maintaining responsiveness to actual movement
 */
export class KalmanFilter {
  private estimate: number;
  private estimateError: number;
  private processNoise: number;
  private measurementNoise: number;

  constructor(
    initialValue: number,
    initialError: number = 1,
    processNoise: number = 0.01,
    measurementNoise: number = 4 // Typical GPS error in meters
  ) {
    this.estimate = initialValue;
    this.estimateError = initialError;
    this.processNoise = processNoise;
    this.measurementNoise = measurementNoise;
  }

  /**
   * Update filter with new measurement
   * @param measurement New GPS reading
   * @param measurementAccuracy Optional accuracy in meters (from GPS)
   * @returns Filtered estimate
   */
  update(measurement: number, measurementAccuracy?: number): number {
    // Use actual GPS accuracy if available
    const noise = measurementAccuracy || this.measurementNoise;

    // Prediction step
    const predictedError = this.estimateError + this.processNoise;

    // Update step (Kalman gain)
    const kalmanGain = predictedError / (predictedError + noise);

    // Calculate new estimate
    this.estimate = this.estimate + kalmanGain * (measurement - this.estimate);
    this.estimateError = (1 - kalmanGain) * predictedError;

    return this.estimate;
  }

  /**
   * Reset filter to new value (useful when large jump detected)
   */
  reset(value: number): void {
    this.estimate = value;
    this.estimateError = 1;
  }

  /**
   * Get current estimate without updating
   */
  getEstimate(): number {
    return this.estimate;
  }
}

/**
 * Coordinate-specific Kalman filter
 */
export class CoordinateKalmanFilter {
  private latFilter: KalmanFilter;
  private lngFilter: KalmanFilter;
  private lastAccuracy: number = 10;

  constructor(initialLat: number, initialLng: number) {
    this.latFilter = new KalmanFilter(initialLat);
    this.lngFilter = new KalmanFilter(initialLng);
  }

  /**
   * Update with new GPS reading
   * @param lat Latitude
   * @param lng Longitude
   * @param accuracy GPS accuracy in meters (optional)
   * @returns Filtered coordinates
   */
  update(
    lat: number,
    lng: number,
    accuracy?: number
  ): { latitude: number; longitude: number } {
    // Store accuracy for adaptive filtering
    if (accuracy !== undefined) {
      this.lastAccuracy = accuracy;
    }

    // Detect large jumps (GPS glitches or teleportation)
    const latDiff = Math.abs(lat - this.latFilter.getEstimate());
    const lngDiff = Math.abs(lng - this.lngFilter.getEstimate());
    const JUMP_THRESHOLD = 0.001; // ~111 meters at equator

    if (latDiff > JUMP_THRESHOLD || lngDiff > JUMP_THRESHOLD) {
      // Large jump detected - reset filters to avoid smoothing over glitch
      this.latFilter.reset(lat);
      this.lngFilter.reset(lng);
      return { latitude: lat, longitude: lng };
    }

    // Normal update
    return {
      latitude: this.latFilter.update(lat, accuracy),
      longitude: this.lngFilter.update(lng, accuracy),
    };
  }

  /**
   * Get last known accuracy
   */
  getAccuracy(): number {
    return this.lastAccuracy;
  }
}
