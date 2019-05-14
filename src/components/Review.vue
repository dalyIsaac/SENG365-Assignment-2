<template>
  <v-card class="review-card">
    <v-card-text>{{ review.reviewBody }}</v-card-text>
    <v-card-stars title="Star rating" :value="review.starRating" :numStars="5"/>
    <v-card-stars title="Cost rating" :value="review.costRating" :numStars="4"/>
    <p
      class="font-italic text-lg-right text-md-right text-sm-center text-xs-center"
    >Written by {{ review.reviewAuthor.username }} on {{ new Date(review.timePosted).toLocaleString() }} UTC</p>
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
