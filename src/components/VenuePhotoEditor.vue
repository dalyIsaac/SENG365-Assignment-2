<template>
  <v-layout>
    <v-flex v-for="photo in localPhotos" v-bind:key="photo.photoFilename" xs12 sm6 md4 row wrap>
      <v-card flat tile>
        <v-img :src="photo.photoFilename" aspect-ratio="2.75"/>

        <v-card-title primary-title>
          <div>
            <div>{{ photo.photoDescription }}</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn color="error">Delete</v-btn>
          <v-btn
            v-if="!photo.isPrimary"
            color="blue darken-3 white--text"
            @click="setPrimary(photo)"
          >Make primary</v-btn>
          <v-btn v-if="photo.isPrimary" disabled color="blue darken-3 white--text">Primary photo</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-snackbar :value="errorSnackbar" color="error" :timeout="0">
      {{ error }}
      <v-btn dark flat @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Photo } from "@/model/Photo";
import { baseUrl } from "../common";

export default Vue.extend({
  beforeMount() {
    this.updatePhotos(this.photos);
  },
  props: {
    photos: { type: Array as () => Photo[] },
    venueId: { type: String }
  },
  data: () => ({
    error: "",
    errorSnackbar: false,
    localPhotos: [] as Photo[]
  }),
  methods: {
    async setPrimary(photo: Photo) {
      try {
        await Vue.axiosAuthorized().post(photo.photoFilename + "/setPrimary");
        this.getPhotos();
      } catch (error) {
        this.error = error.response ? error.response.statusText : error;
        this.errorSnackbar = true;
      }
    },
    async getPhotos() {
      const res = await Vue.axiosAuthorized().get(`/venues/${this.venueId}`);
      this.updatePhotos(res.data.photos);
    },
    updatePhotos(photos: Photo[]) {
      this.localPhotos = [];
      photos.forEach(photo => {
        this.localPhotos.push({
          ...photo,
          photoFilename: `${baseUrl}/venues/${this.venueId}/photos/${
            photo.photoFilename
          }`
        });
      });
    }
  }
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
