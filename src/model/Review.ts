export interface Review {
  reviewAuthor: {
    userId: number;
    username: string;
  };
  reviewBody: string;
  starRating: number;
  costRating: number;
  timePosted: string;
}
