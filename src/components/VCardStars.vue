<template>
  <v-list-tile>
    <v-list-tile-content>{{ title }}</v-list-tile-content>
    <v-list-tile-content class="align-end">
      <div class="table-rating-wrapper">
        <v-rating
          class="table-rating-stars"
          dense
          :length="numStars"
          half-increments
          readonly
          v-model="value"
          small
          :full-icon="fullIcon"
          :half-icon="halfIcon"
        ></v-rating>
        <p class="stars-text">{{ value }} / {{ numStars }}</p>
      </div>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    title: {
      type: String
    },
    value: {
      type: Number
    },
    numStars: {
      type: Number
    },
    fullIcon: {
      type: String
    },
    halfIcon: {
      type: String
    }
  }
});
</script>

<style>
.stars-wrapper {
  display: grid;
  grid-template-columns: auto auto;
  width: 100%;
}

.stars-text {
  grid-column: 2;
  line-height: 28.8px;
  margin: 0;
  padding: 0 4px 0 0;
  text-align: right;
}
</style>
