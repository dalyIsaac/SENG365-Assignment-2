<template>
  <v-container>
    <v-layout align-center justify-start column fill-height v-if="!isEmpty(venue)">
      <h1>{{ venue.venueName }}</h1>
      <h3 class="mb-3 font-italic font-weight-medium">{{ venue.address }} - {{venue.city}}</h3>
      <v-carousel>
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
          <v-flex xs12 sm12 md7>
            <p class="ma-3">{{ venue.shortDescription }}</p>
            <p class="ma-3" v-if="showLongDescription">{{ venue.longDescription }}</p>

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

          <v-flex xs12 sm12 md5>
            <v-card>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>Category:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ venue.category.categoryName }}</v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content>Mean star rating:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <div class="tableRatingWrapper">
                      <v-rating
                        class="tableRatingStars"
                        dense
                        half-increments
                        readonly
                        v-model="meanStarRating"
                      ></v-rating>
                      <p class="tableRatingText">{{round(meanStarRating, 1)}} / 5</p>
                    </div>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content>Mode cost rating:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <div class="tableRatingWrapper">
                      <v-rating
                        class="tableRatingStars"
                        dense
                        half-increments
                        readonly
                        v-model="modeCostRating"
                      ></v-rating>
                      <p class="tableRatingText">{{round(modeCostRating, 1)}} / 5</p>
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <div class="full-width">
        <p
          class="font-italic text-lg-right text-md-right text-sm-center text-xs-center"
        >Added by {{ venue.admin.username }} on {{ new Date(venue.dateAdded).toLocaleString() }} UTC</p>
      </div>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import { isEmpty, max, round } from "lodash";
import Vue from "vue";

import { baseUrl } from "../common";

interface Review {
  reviewAuthor: {
    userId: number;
    username: string;
  };
  reviewBody: string;
  starRating: number;
  costRating: number;
  timePosted: string;
}

interface Photo {
  photoFilename: string;
  photoDescription: string;
  isPrimary: boolean;
}

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

export default Vue.extend({
  props: {
    id: { type: String }
  },
  data: () => ({
    baseUrl,
    venue: {} as Venue,
    reviews: [] as Review[],
    meanStarRating: 0,
    modeCostRating: 0,
    showLongDescription: false
  }),
  beforeMount() {
    axios
      .get(baseUrl + "/venues/" + this.id)
      .then(res => {
        this.venue = res.data;
      })
      .catch(err => {
        console.error(err);
        this.$router.push({ name: "404" });
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
      this.modeCostRating = costRatings[max(costRatings)!];
    }
  }
});
</script>

<style>
.full-width {
  width: 100%;
}

.tableRatingWrapper {
  display: grid;
  grid-template-rows: 21px auto;
}

.tableRatingStars {
  grid-row: 1;
}

.tableRatingText {
  grid-row: 2;
  margin: 0;
  padding: 0;
  text-align: right;
}
</style>
