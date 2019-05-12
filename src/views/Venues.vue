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

    <div v-if="moreVenuesExist || startIndex > 0" class="listPosition">
      <h2 class="listPositionText">{{ startIndex + 1 }} - {{ startIndex + venues.length }}</h2>
      <v-btn class="listPositionAfter" fab dark small color="primary" v-if="moreVenuesExist">
        <v-icon dark>keyboard_arrow_right</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { isString, isEmpty } from "lodash";

import { baseUrl } from "../common";
import { Venue, VenueResponse } from "../model/Venue";
import { Category } from "../model/Category";

import VenueComponent from "@/components/Venue.vue";

interface RouterArgs {
  startIndex?: number;
  count?: number;
  city?: string;
  q?: string;
  categoryId?: number;
  minStarRating?: number;
  maxCostRating?: number;
  adminId?: number;
  sortBy: string;
  reverseSort: boolean;
  myLatitude?: number;
  myLongitude?: number;
}

const sortByOptions = [
  { queryKey: "STAR_RATING", name: "Mean star rating" },
  { queryKey: "COST_RATING", name: "Mode cost rating" }
];

export default Vue.extend({
  beforeMount() {
    this.getCategories();

    if (!isEmpty(this.routerArgs)) {
      const {
        startIndex,
        city,
        q,
        categoryId,
        minStarRating,
        maxCostRating,
        adminId,
        sortBy,
        reverseSort,
        myLatitude,
        myLongitude
      } = this.routerArgs;

      const params = {
        startIndex,
        count: 11,
        city,
        q,
        categoryId,
        minStarRating,
        maxCostRating,
        adminId,
        sortBy,
        reverseSort,
        myLatitude,
        myLongitude
      };
      if (!isEmpty(params)) {
        this.getVenues(params);
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.getCurrentPosition,
        undefined,
        { enableHighAccuracy: true }
      );
    }
  },
  components: { Venue: VenueComponent },
  data: () => ({
    categories: [] as Category[],
    category: {} as Category,
    city: "",
    desc: true,
    geolocation: null as Position | null,
    name: "",
    selectedSort: sortByOptions[0],
    sortByOptions,
    startIndex: 0,
    moreVenuesExist: false,
    venues: [] as Venue[]
  }),
  methods: {
    async getVenues(params: RouterArgs): Promise<void> {
      this.venues = [];
      // @ts-ignore
      this.$router.push({ path: "venues", query: params });

      const venues: VenueResponse[] = (await axios.get(baseUrl + "/venues", {
        params
      })).data;

      if (venues.length > 10) {
        this.moreVenuesExist = true;
        venues.pop();
      } else {
        this.moreVenuesExist = false;
      }

      venues.forEach(({ primaryPhoto, ...venue }, i) => {
        const currentVenue: Venue = venue;
        if (isString(primaryPhoto)) {
          currentVenue.primaryPhoto = `${baseUrl}/venues/${
            venue.venueId
          }/photos/${primaryPhoto}`;
        }
        this.venues.push(currentVenue);
      });
    },
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

        const params = {
          categoryId: this.category ? this.category.categoryId : undefined,
          city: this.city || undefined,
          count: 11,
          myLatitude: latitude,
          myLongitude: longitude,
          q: this.name || undefined,
          reverseSort,
          sortBy: this.selectedSort.queryKey,
          startIndex: this.startIndex
        };
        this.getVenues(params);
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
  props: {
    routerArgs: {
      type: Object as () => Exclude<RouterArgs, "count">
    }
  }
});
</script>

<style>
/* Margin top when height is 36px */
.mt36 {
  margin-top: 8px;
}

.listPosition {
  display: grid;
  grid-template-columns: 40px auto 40px;
  width: 200px;
  margin: auto;
}

.listPositionBefore {
  grid-column: 1;
}

.listPositionText {
  grid-column: 2;
  line-height: 50px;
  text-align: center;
}

.listPositionAfter {
  grid-column: 3;
}
</style>
