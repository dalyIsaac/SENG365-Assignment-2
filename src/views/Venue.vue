<template>
  <v-container>{{ id }}</v-container>
</template>

<script lang="ts">
import axios from "axios";
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
  data: () => ({ venue: {} as Venue }),
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
  }
});
</script>
