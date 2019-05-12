<template>
  <v-container>
    <v-layout align-start justify-start row>
      <v-text-field label="City" v-model="city"></v-text-field>
      <v-btn color="info" @click="submit">Search</v-btn>
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
import { Category, CategoryTable } from "../model/Category";

import VenueComponent from "@/components/Venue.vue";

export default Vue.extend({
  components: { Venue: VenueComponent },
  data: () => ({
    city: "",
    venues: [] as Venue[],
    categories: {} as CategoryTable
  }),
  methods: {
    async submit(): Promise<void> {
      try {
        this.venues = [];
        const venues: VenueResponse[] = (await axios.get(baseUrl + "/venues", {
          params: { city: this.city || undefined }
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

        this.categories = (await axios.get(
          baseUrl + "/categories"
        )).data.reduce((acc: CategoryTable, curr: Category) => {
          acc[curr.categoryId] = curr;
          return acc;
        }, {});
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>
