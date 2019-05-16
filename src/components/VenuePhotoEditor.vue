<template>
  <v-layout>
    <v-flex v-for="photo in photos" v-bind:key="photo.photoFilename" xs12 sm6 md4>
      <v-card flat tile>
        <div
          v-if="photo.isPrimary"
          class="blue darken-3"
          style="{width: 100%; padding: 0; margin: 0;}"
        >
          <p
            class="font-weight-medium"
            style="{padding: 0; margin: 0; color: white; text-align: center;}"
          >PRIMARY PHOTO</p>
        </div>
        <v-img
          :src="`${baseUrl}/venues/${venueId}/photos/${photo.photoFilename}`"
          aspect-ratio="2.75"
        ></v-img>

        <v-card-title primary-title>
          <div>
            <div>{{ photo.photoDescription }}</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn color="error">Delete</v-btn>
          <v-btn v-if="!photo.isPrimary" color="blue darken-3">Make primary</v-btn>
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
