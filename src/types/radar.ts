export type ProximityZone = 'arrived' | 'near' | 'medium' | 'far';

export interface RadarData {
  distance: number;
  relativeAngle: number;
  proximityZone: ProximityZone;
  userLocation: { latitude: number; longitude: number } | null;
  heading: number | null;
  accuracy: number | null; // GPS accuracy in meters
  speed: number | null; // Speed in meters per second
  eta: number | null; // Estimated time of arrival in seconds
  progress?: number; // Journey progress percentage (0-100)
}
