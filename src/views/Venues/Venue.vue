<template>
  <v-container>
    <v-btn
      v-if="!isEmpty(venue) && userId === venue.admin.userId"
      fab
      bottom
      right
      fixed
      dark
      large
      class="ma-4"
      color="primary"
      @click="editVenue"
    >
      <v-icon dark>edit</v-icon>
    </v-btn>
    <v-layout align-center justify-start column fill-height v-if="!isEmpty(venue)">
      <h1>{{ venue.venueName }}</h1>
      <h3 class="mb-3 font-italic font-weight-medium">{{ venue.address }} - {{venue.city}}</h3>
      <v-carousel v-if="!isEmpty(venue.photos)">
        <v-carousel-item
          v-for="(item, i) in venue.photos"
          :key="i"
          :src="`${baseUrl}/venues/${id}/photos/${item.photoFilename}`"
          reverse-transition="fade"
          transition="fade"
        ></v-carousel-item>
      </v-carousel>

      <v-container grid-list-xl fluid>
        <v-layout row wrap>
          <v-flex xs12 sm12 md6>
            <p class="ma-3 subheading font-weight-regular">{{ venue.shortDescription }}</p>
            <p
              class="ma-3 subheading font-weight-regular"
              v-if="showLongDescription"
            >{{ venue.longDescription }}</p>

            <v-layout align-start justify-center row fill-height class="full-width">
              <div class="full-width">
                <v-divider class="ma-4"/>
              </div>
              <v-btn fab dark small color="primary" @click="updateShowLongDescription">
                <v-icon dark>{{ showLongDescription ? "keyboard_arrow_up" : "keyboard_arrow_down" }}</v-icon>
              </v-btn>
              <div class="full-width">
                <v-divider class="ma-4"/>
              </div>
            </v-layout>
          </v-flex>

          <v-flex xs12 sm12 md6>
            <v-card>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>Category:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ venue.category.categoryName }}</v-list-tile-content>
                </v-list-tile>

                <v-card-stars
                  title="Mean star rating"
                  :value="round(meanStarRating, 1)"
                  :numStars="5"
                />

                <v-card-stars
                  title="Mode cost rating"
                  :value="round(modeCostRating, 1)"
                  :numStars="4"
                />
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <div class="full-width">
        <p
          class="font-italic text-lg-right text-md-right text-sm-center text-xs-center mr-4"
        >Added by {{ venue.admin.username }} on {{ new Date(venue.dateAdded).toLocaleString() }} UTC</p>
      </div>
    </v-layout>

    <v-layout align-center justify-start column fill-height v-if="!isEmpty(reviews)">
      <h1>Reviews</h1>
      <Review
        v-for="review in reviews"
        :review="review"
        v-bind:key="review.userId + review.timePosted"
      />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import { isEmpty, max, round } from "lodash";
import Vue from "vue";

import { baseUrl } from "@/common";
import ReviewComponent from "@/components/Review.vue";
import { Review } from "@/model/Review";
import { Photo } from "@/model/Photo";
import VCardStars from "@/components/VCardStars.vue";

interface Venue {
  venueName: string;
  admin: {
    userId: number;
    username: string;
  };
  category: {
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
  };
  city: string;
  shortDescription: string;
  longDescription: string;
  dateAdded: string;
  address: string;
  latitude: number;
  longitude: number;
  photos: Photo[];
}

/**
 * Based on https://stackoverflow.com/a/11301464/5018082
 */
function indexOfMax(arr: number[]) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

export default Vue.extend({
  components: { Review: ReviewComponent, "v-card-stars": VCardStars },
  props: {
    id: { type: String }
  },
  data: () => ({
    baseUrl,
    venue: {} as Venue,
    reviews: [] as Review[],
    meanStarRating: 0,
    modeCostRating: 0,
    showLongDescription: false,
    userId: -1 as number | null
  }),
  beforeMount() {
    this.userId = Vue.getUserId();
    axios
      .get(baseUrl + "/venues/" + this.id)
      .then(res => {
        this.venue = res.data;
      })
      .catch(err => {
        console.error(err);
        this.$router.push({ name: "invalid" });
      });
    axios
      .get(baseUrl + "/venues/" + this.id + "/reviews")
      .then(res => {
        this.reviews = res.data;
        this.updateRatingAverages(this.reviews);
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    isEmpty,
    round,
    updateShowLongDescription(): void {
      this.showLongDescription = !this.showLongDescription;
    },
    updateRatingAverages(reviews: Review[]): void {
      const costRatings = [0, 0, 0, 0, 0];
      let totalStarRatings = 0;
      reviews.forEach(el => {
        totalStarRatings += el.starRating;
        costRatings[el.costRating] += 1;
      });

      this.meanStarRating = totalStarRatings / reviews.length || 0;
      this.modeCostRating = indexOfMax(costRatings);
    },
    editVenue() {
      this.$router.push(`/venues/${this.id}/edit`);
    }
  }
});
</script>

<style>
.full-width {
  width: 100%;
}

.table-rating-wrapper {
  display: grid;
  grid-template-rows: 21px auto;
}

.table-rating-stars {
  grid-row: 1;
}

.table-rating-text {
  grid-row: 2;
  margin: 0;
  padding: 0;
  text-align: right;
}
</style>
