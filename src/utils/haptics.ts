import * as Haptics from 'expo-haptics';
import { ProximityZone } from '../types/radar';

/**
 * Haptic feedback manager for proximity-based navigation cues
 */
export class ProximityHapticsManager {
  private lastZone: ProximityZone | null = null;
  private lastHapticTime: number = 0;
  private MIN_HAPTIC_INTERVAL = 2000; // Minimum 2 seconds between haptics

  /**
   * Trigger appropriate haptic feedback when proximity zone changes
   */
  onZoneChange(newZone: ProximityZone): void {
    // Don't trigger if zone hasn't changed
    if (newZone === this.lastZone) {
      return;
    }

    // Throttle haptics to prevent excessive feedback
    const now = Date.now();
    if (now - this.lastHapticTime < this.MIN_HAPTIC_INTERVAL) {
      this.lastZone = newZone;
      return;
    }

    // Trigger zone-specific haptic pattern
    switch (newZone) {
      case 'arrived':
        // Strong celebration pattern
        this.triggerArrivalPattern();
        break;
      case 'near':
        // Medium intensity - getting close
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'medium':
        // Light tap - moving closer
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'far':
        // No haptic for far zone (or very light if entering from null)
        if (this.lastZone !== null) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        break;
    }

    this.lastZone = newZone;
    this.lastHapticTime = now;
  }

  /**
   * Special celebration pattern for arrival
   */
  private async triggerArrivalPattern(): Promise<void> {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 100);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 200);
  }

  /**
   * Trigger haptic when user is significantly off-course
   * @param angleDeviation How far off-course (0-180 degrees)
   */
  onOffCourse(angleDeviation: number): void {
    if (angleDeviation > 120) {
      // Heading wrong direction - double tap warning
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 150);
    }
  }

  /**
   * Reset manager state
   */
  reset(): void {
    this.lastZone = null;
    this.lastHapticTime = 0;
  }
}

/**
 * Global haptics manager instance
 */
export const proximityHaptics = new ProximityHapticsManager();
