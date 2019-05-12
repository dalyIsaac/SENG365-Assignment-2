<template>
  <v-container>
    <v-layout align-start justify-start row>
      <v-text-field class="mr-4" label="Name" v-model="name"></v-text-field>
      <v-text-field class="mr-4" label="City" v-model="city"></v-text-field>
      <v-select
        :items="categories"
        item-text="categoryName"
        label="Category"
        v-model="category"
        return-object
      ></v-select>
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
import { Category } from "../model/Category";

import VenueComponent from "@/components/Venue.vue";

export default Vue.extend({
  components: { Venue: VenueComponent },
  data: () => ({
    city: "",
    name: "",
    venues: [] as Venue[],
    category: {} as Category | undefined,
    categories: {} as Category[]
  }),
  methods: {
    async submit(): Promise<void> {
      try {
        this.venues = [];
        const venues: VenueResponse[] = (await axios.get(baseUrl + "/venues", {
          params: {
            city: this.city || undefined,
            q: this.name || undefined,
            categoryId: this.category ? this.category.categoryId : undefined
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
    }
  },
  beforeMount() {
    this.getCategories();
  }
});
</script>
