import { Category } from "./Category";

interface VenueBase {
  venueId: number;
  venueName: string;
  city: string;
  shortDescription: string;
  latitude: number;
  longitude: number;
  meanStarRating: number;
  modeCostRating: number;
  distance: number;
  primaryPhoto: string;
}

export interface VenueResponse extends VenueBase {
  categoryId: number;
}

export interface Venue extends VenueBase {
  category: Category;
}
