import { isEmpty, toNumber } from "lodash";
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

export const venueMaximums = {
  venueName: 64,
  city: 128,
  shortDescription: 128,
  longDescription: 2048,
  address: 256
};

export const venueRules = {
  venueNameRules: [
    (v: string) => !!v || "The venue's name must not be empty",
    (v: string) =>
      v.length <= venueMaximums.venueName ||
      `The venue's name must be less than ${venueMaximums.venueName} characters`
  ],
  categoryNameRules: [
    (v: Category) => !isEmpty(v) || "Please select a category"
  ],
  cityRules: [
    (v: string) => !!v || "The city must not be empty",
    (v: string) =>
      v.length <= venueMaximums.city ||
      `The venue's name must be less than ${venueMaximums.city} characters`
  ],
  shortDescriptionRules: [
    (v: string) => !!v || "The short description must not be empty",
    (v: string) =>
      v.length <= venueMaximums.shortDescription ||
      `The venue's name must be less than ${
        venueMaximums.shortDescription
      } characters`
  ],
  longDescriptionRules: [
    (v: string) => !!v || "The long description must not be empty",
    (v: string) =>
      v.length <= venueMaximums.longDescription ||
      `The venue's name must be less than ${
        venueMaximums.longDescription
      } characters`
  ],
  addressRules: [
    (v: string) => !!v || "The address must not be empty",
    (v: string) =>
      v.length <= venueMaximums.address ||
      `The venue's name must be less than ${venueMaximums.address} characters`
  ],
  longitudeRules: [
    (v: string) => !!v || "Coordinates cannot be empty",
    (v: string) => {
      const n = toNumber(v);
      return (
        (-180 <= n && n <= 180) ||
        "Longitude must be a number between -180 and 180"
      );
    }
  ],
  latitudeRules: [
    (v: string) => !!v || "Coordinates cannot be empty",
    (v: string) => {
      const n = toNumber(v);
      return (
        (-90 <= n && n <= 90) || "Latitude must be a number between -90 and 90"
      );
    }
  ]
};
