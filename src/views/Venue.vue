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
import { isEmpty } from "lodash";
import Vue from "vue";

import { baseUrl } from "../common";

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
  data: () => ({ venue: {} as Venue, baseUrl, showLongDescription: false }),
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
  },
  methods: {
    isEmpty,
    updateShowLongDescription() {
      this.showLongDescription = !this.showLongDescription;
    }
  }
});
</script>

<style>
.full-width {
  width: 100%;
}
</style>
