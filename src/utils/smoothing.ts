/**
 * Exponential Moving Average for smooth sensor readings
 * Balances between responsiveness and noise reduction
 */
export class ExponentialMovingAverage {
  private value: number | null = null;
  private alpha: number;

  /**
   * @param alpha Smoothing factor (0-1). Lower = smoother, higher = more responsive
   *              0.1 = very smooth (good for noisy compass)
   *              0.3 = balanced
   *              0.5 = responsive
   */
  constructor(alpha: number = 0.2) {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }

  /**
   * Update with new value
   * @param newValue New sensor reading
   * @returns Smoothed value
   */
  update(newValue: number): number {
    if (this.value === null) {
      this.value = newValue;
      return newValue;
    }

    this.value = this.alpha * newValue + (1 - this.alpha) * this.value;
    return this.value;
  }

  /**
   * Reset to new value
   */
  reset(value: number): void {
    this.value = value;
  }

  /**
   * Get current smoothed value
   */
  getValue(): number | null {
    return this.value;
  }
}

/**
 * Circular (angular) Exponential Moving Average
 * Properly handles 0°/360° wraparound for compass headings
 */
export class CircularEMA {
  private sinAvg: number = 0;
  private cosAvg: number = 0;
  private alpha: number;
  private initialized: boolean = false;

  /**
   * @param alpha Smoothing factor (0-1). Lower = smoother
   */
  constructor(alpha: number = 0.15) {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }

  /**
   * Update with new angle
   * @param angleDegrees New angle in degrees (0-360)
   * @returns Smoothed angle in degrees
   */
  update(angleDegrees: number): number {
    const angleRad = (angleDegrees * Math.PI) / 180;
    const sin = Math.sin(angleRad);
    const cos = Math.cos(angleRad);

    if (!this.initialized) {
      this.sinAvg = sin;
      this.cosAvg = cos;
      this.initialized = true;
      return angleDegrees;
    }

    // Exponential moving average on sin/cos components
    this.sinAvg = this.alpha * sin + (1 - this.alpha) * this.sinAvg;
    this.cosAvg = this.alpha * cos + (1 - this.alpha) * this.cosAvg;

    // Convert back to degrees
    const smoothedRad = Math.atan2(this.sinAvg, this.cosAvg);
    const smoothedDeg = (smoothedRad * 180) / Math.PI;

    // Normalize to 0-360
    return (smoothedDeg + 360) % 360;
  }

  /**
   * Reset filter
   */
  reset(): void {
    this.sinAvg = 0;
    this.cosAvg = 0;
    this.initialized = false;
  }

  /**
   * Get angular velocity (rate of change)
   * Useful for detecting rapid turns vs. sensor noise
   */
  getAngularVelocity(newAngle: number, previousAngle: number, deltaTime: number): number {
    // Handle wraparound
    let diff = newAngle - previousAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    return diff / deltaTime; // degrees per second
  }
}

/**
 * Moving Average Filter with configurable window size
 */
export class MovingAverage {
  private values: number[] = [];
  private windowSize: number;

  constructor(windowSize: number = 5) {
    this.windowSize = Math.max(1, windowSize);
  }

  /**
   * Add new value and get average
   */
  update(newValue: number): number {
    this.values.push(newValue);

    if (this.values.length > this.windowSize) {
      this.values.shift();
    }

    return this.values.reduce((sum, val) => sum + val, 0) / this.values.length;
  }

  /**
   * Get current average without updating
   */
  getAverage(): number | null {
    if (this.values.length === 0) return null;
    return this.values.reduce((sum, val) => sum + val, 0) / this.values.length;
  }

  /**
   * Clear all values
   */
  reset(): void {
    this.values = [];
  }
}
