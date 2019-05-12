import { Category } from "./Category";

export interface VenueBase {
  venueId: number;
  venueName: string;
  city: string;
  shortDescription: string;
  latitude: number;
  longitude: number;
  meanStarRating: number;
  modeCostRating: number;
  distance: number;
}

export interface VenueResponse extends VenueBase {
  categoryId: number;
  primaryPhoto?: string;
}

export interface Venue extends VenueBase {
  primaryPhoto?: any;
}
