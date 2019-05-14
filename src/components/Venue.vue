<template>
  <v-flex pa-0>
    <v-card flat tile ma-0 pa-0>
      <div style="{width: 100%; background-color: #4c8c4a; padding: 0; margin: 0;}">
        <p
          style="{padding: 0; margin: 0; color: white; text-align: center;}"
        >{{ categories[venue.categoryId - 1].categoryName }}</p>
      </div>
      <v-img
        :src="venue.primaryPhoto"
        :lazy-src="require('@/assets/imagePlaceholder.jpg')"
        aspect-ratio="2.75"
      ></v-img>

      <div class="content">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{ venue.venueName }}</h3>
            <p>{{ venue.city }}</p>
            <p class="description">{{ venue.shortDescription }}</p>
          </div>
        </v-card-title>
      </div>

      <div class="ratingWrapper">
        <p class="font-weight-medium">Mean star rating</p>
        <v-rating class="ratingStars" dense half-increments readonly v-model="venue.meanStarRating"></v-rating>
        <p class="ratingText">{{ round(venue.meanStarRating, 1) }} / 5</p>
      </div>

      <div class="ratingWrapper">
        <p class="font-weight-medium">Mode cost rating</p>
        <v-rating
          class="ratingStars"
          :length="4"
          dense
          half-increments
          readonly
          v-model="venue.modeCostRating"
        ></v-rating>
        <p class="ratingText">{{ round(venue.modeCostRating, 1) }} / 4</p>
      </div>

      <v-card-actions>
        <v-btn flat color="orange" @click="routeTo">Explore</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { round } from "lodash";
import { Venue } from "../model/Venue";
import { Category } from "@/model/Category";
import { Dictionary } from "vue-router/types/router";

export default Vue.extend({
  props: {
    venue: {
      type: Object as () => Venue
    },
    categories: {
      type: Array as () => Category[]
    }
  },
  methods: {
    round,
    routeTo() {
      this.$router.push({
        name: "individualVenue",
        params: { id: this.venue.venueId.toString() } as Dictionary<string>
      });
      // this.$router.push(`/venues/${this.venue.venueId}`);
    }
  }
});
</script>

<style>
.ratingWrapper {
  display: grid;
  grid-template-rows: 21px auto;
  grid-template-columns: auto 50px;
  padding: 16px 16px 0 16px;
}

.ratingStars {
  grid-row: 2;
}

.ratingText {
  grid-row: 2;
  line-height: 28.8px;
  margin: 0;
  padding: 0;
  text-align: right;
}

.content {
  height: 250px;
}

.description {
  overflow-y: auto;
  max-height: 200px;
}
</style>
