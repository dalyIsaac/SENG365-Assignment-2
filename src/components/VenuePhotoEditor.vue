<template>
  <v-layout>
    <v-flex v-for="photo in photos" v-bind:key="photo.photoFilename" xs12 sm6 md4 row wrap>
      <v-card flat tile>
        <v-img
          :src="`${baseUrl}/venues/${venueId}/photos/${photo.photoFilename}`"
          aspect-ratio="2.75"
        />

        <v-card-title primary-title>
          <div>
            <div>{{ photo.photoDescription }}</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn color="error">Delete</v-btn>
          <v-btn v-if="!photo.isPrimary" color="blue darken-3 white--text">Make primary</v-btn>
          <v-btn v-if="photo.isPrimary" disabled color="blue darken-3 white--text">Primary photo</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Photo } from "@/model/Photo";
import { baseUrl } from "../common";

export default Vue.extend({
  props: {
    photos: { type: Array as () => Photo[] },
    venueId: { type: String }
  },
  data: () => ({
    baseUrl
  })
});
</script>

<style>
.primary-div {
  width: 100%;
  padding: 0;
  margin: 0;
}

.primary-text {
  padding: 0;
  margin: 0;
  color: white;
  text-align: center;
}
</style>
