export interface Spot {
  id: string;
  nameEn: string;
  nameJa: string;
  latitude: number;
  longitude: number;
  color: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VisitedSpotRecord {
  spotId: string;
  visitedAt: number;
  photoUri?: string;
}
