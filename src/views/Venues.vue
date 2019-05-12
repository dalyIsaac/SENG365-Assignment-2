<template>
  <v-container>
    <v-layout align-start justify-start row>
      <v-text-field class="mr-4" label="Name" v-model="name"></v-text-field>
      <v-text-field class="mr-4" label="City" v-model="city"></v-text-field>
      <v-select
        class="mr-4"
        :items="categories"
        item-text="categoryName"
        label="Category"
        v-model="category"
        return-object
      ></v-select>
      <v-select
        class="mr-4"
        :items="sortByOptions"
        item-text="name"
        label="Sort by"
        v-model="selectedSort"
        return-object
      ></v-select>
      <v-btn-toggle @change="updateSortDir" mandatory class="mt36">
        <v-btn flat>
          <v-icon>keyboard_arrow_down</v-icon>
        </v-btn>
        <v-btn flat>
          <v-icon>keyboard_arrow_up</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn color="info" @click="submit" class="mt36">Search</v-btn>
    </v-layout>

    <v-layout align-start justify-center row fill-height>
      <v-flex xs12 sm12>
        <v-container grid-list-xl fluid>
          <v-layout row wrap>
            <v-flex v-for="venue in venues" :key="venue.venueId" xs12 sm6 md4>
              <v-card flat tile>
                <Venue v-bind:venue="venue" v-bind:categories="categories"/>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { isString } from "lodash";

import { baseUrl } from "../common";
import { Venue, VenueResponse } from "../model/Venue";
import { Category } from "../model/Category";

import VenueComponent from "@/components/Venue.vue";

const sortByOptions = [
  { queryKey: "STAR_RATING", name: "Mean star rating" },
  { queryKey: "COST_RATING", name: "Mode cost rating" }
];

export default Vue.extend({
  components: { Venue: VenueComponent },
  data: () => ({
    city: "",
    name: "",
    venues: [] as Venue[],
    category: {} as Category,
    categories: [] as Category[],
    sortByOptions,
    selectedSort: sortByOptions[0],
    desc: true,
    geolocation: null as Position | null
  }),
  methods: {
    async submit(): Promise<void> {
      try {
        let reverseSort = false;
        switch (this.selectedSort.queryKey) {
          case "STAR_RATING":
            reverseSort = this.desc ? true : false;
            break;
          case "COST_RATING":
          case "DISTANCE":
            reverseSort = this.desc ? false : true;
            break;
          default:
            break;
        }

        let latitude, longitude;
        if (this.geolocation) {
          ({ latitude, longitude } = this.geolocation.coords);
        }

        this.venues = [];
        const venues: VenueResponse[] = (await axios.get(baseUrl + "/venues", {
          params: {
            city: this.city || undefined,
            q: this.name || undefined,
            categoryId: this.category ? this.category.categoryId : undefined,
            sortBy: this.selectedSort.queryKey,
            reverseSort,
            myLatitude: latitude,
            myLongitude: longitude
          }
        })).data;

        venues.forEach(({ primaryPhoto, ...venue }, i) => {
          const currentVenue: Venue = venue;
          if (isString(primaryPhoto)) {
            currentVenue.primaryPhoto = `${baseUrl}/venues/${
              venue.venueId
            }/photos/${primaryPhoto}`;
          }
          this.venues.push(currentVenue);
        });
      } catch (err) {
        console.error(err);
      }
    },
    getCategories() {
      axios
        .get(baseUrl + "/categories")
        .then(res => {
          this.categories = res.data;
        })
        .catch(err => console.error(err));
    },
    updateSortDir() {
      this.desc = !this.desc;
    },
    getCurrentPosition(position: Position): void {
      this.geolocation = position;
      this.sortByOptions.push({ queryKey: "DISTANCE", name: "Distance" });
    }
  },
  beforeMount() {
    this.getCategories();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.getCurrentPosition,
        undefined,
        { enableHighAccuracy: true }
      );
    }
  }
});
</script>

<style>
/* Margin top when height is 36px */
.mt36 {
  margin-top: 8px;
}
</style>
