export type ProximityZone = 'arrived' | 'near' | 'medium' | 'far';

export interface RadarData {
  distance: number;
  relativeAngle: number;
  proximityZone: ProximityZone;
  userLocation: { latitude: number; longitude: number } | null;
  heading: number | null;
}
