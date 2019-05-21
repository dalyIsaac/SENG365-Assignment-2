<template>
  <v-card class="review-card">
    <v-card-text class="subheading font-weight-regular">{{ review.reviewBody }}</v-card-text>
    <v-card-stars
      title="Star rating"
      :value="review.starRating"
      :numStars="5"
      full-icon="star"
      half-icon="star-half"
    />
    <v-card-stars
      title="Cost rating"
      :value="review.costRating"
      :numStars="4"
      full-icon="attach_money"
      half-icon="attach_money"
    />
    <p class="font-italic text-lg-right text-md-right text-sm-center text-xs-center mt-1 mr-4 mb-3">
      Written by
      <router-link :to="`/users/${review.reviewAuthor.userId}`">{{ review.reviewAuthor.username }}</router-link>
      on {{ new Date(review.timePosted).toLocaleString() }} UTC
    </p>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { Review } from "@/model/Review";
import VCardStars from "./VCardStars.vue";

export default Vue.extend({
  components: {
    "v-card-stars": VCardStars
  },
  props: {
    review: {
      type: Object as () => Review
    }
  }
});
</script>

<style>
.review-card {
  width: 100%;
}
</style>
