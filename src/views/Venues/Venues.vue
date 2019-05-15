<template>
  <v-container>
    <v-layout align-start justify-start row wrap>
      <v-text-field class="mr-4" label="Name" v-model="name"></v-text-field>
      <v-text-field class="mr-4" label="City" v-model="city"></v-text-field>
      <v-select
        class="mr-4"
        :items="categories"
        item-text="categoryName"
        label="Category"
        :clearable="true"
        return-object
        v-model="selectedCategory"
        v-on:change="updateSelectedCategory"
      ></v-select>
      <v-select
        class="mr-4"
        :items="sortByOptions"
        item-text="name"
        label="Sort by"
        v-model="selectedSort"
        return-object
      ></v-select>
      <v-btn-toggle v-model="desc" mandatory class="mr-4 mt-3">
        <v-tooltip bottom>
          <v-btn flat slot="activator">
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
          <span>Descending</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn flat slot="activator">
            <v-icon>keyboard_arrow_up</v-icon>
          </v-btn>
          <span>Ascending</span>
        </v-tooltip>
      </v-btn-toggle>
      <v-slider
        v-model="minStarRating"
        always-dirty
        hint="Minimum star rating"
        min="0"
        max="5"
        :tick-labels="[0, 1, 2, 3, 4, 5]"
        thumb-label
        persistent-hint
        ticks="always"
        tick-size="3"
        class="mr-4"
      ></v-slider>
      <v-slider
        v-model="maxCostRating"
        always-dirty
        hint="Maximum cost rating"
        min="0"
        max="4"
        thumb-label
        persistent-hint
        ticks="always"
        :tick-labels="['Free', '$', '$$', '$$$', '$$$$']"
        tick-size="3"
        class="mr-4"
        v-bind:style="{width: '300px'}"
      ></v-slider>
      <v-btn color="info" @click="submit" class="mt36">Search</v-btn>
    </v-layout>

    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex v-for="venue in venues" :key="venue.venueId" xs12 sm6 md4>
          <v-card flat tile>
            <Venue v-bind:venue="venue" v-bind:categories="categories"/>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <div v-if="moreVenuesExist || this.startIndex > 0" class="listPosition">
      <v-btn
        class="listPositionBefore"
        fab
        dark
        small
        color="primary"
        v-if="this.startIndex > 0"
        @click="moveBatch(-10)"
      >
        <v-icon dark>keyboard_arrow_left</v-icon>
      </v-btn>
      <h2 class="listPositionText">{{ this.startIndex + 1 }} - {{ this.startIndex + venues.length }}</h2>
      <v-btn
        class="listPositionAfter"
        fab
        dark
        small
        color="primary"
        v-if="moreVenuesExist"
        @click="moveBatch(10)"
      >
        <v-icon dark>keyboard_arrow_right</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import { isString, isEmpty, isSafeInteger, toSafeInteger } from "lodash";
import Vue from "vue";
import { Route } from "vue-router";

import VenueComponent from "@/components/Venue.vue";
import { baseUrl } from "@/common";
import { Category } from "@/model/Category";
import { Venue, VenueResponse } from "@/model/Venue";

interface GetVenueArgs {
  startIndex?: number;
  count?: number;
  city?: string;
  q?: string;
  categoryId?: number;
  minStarRating?: number;
  maxCostRating?: number;
  adminId?: number;
  sortBy?: string;
  reverseSort?: boolean;
  myLatitude?: number;
  myLongitude?: number;
}

const sortByOptions = [
  { queryKey: "STAR_RATING", name: "Mean star rating" },
  { queryKey: "COST_RATING", name: "Mode cost rating" }
];

export default Vue.extend({
  /**
   * Vue hook which triggers before mounting this component.
   * Gets all the categories from the database.
   * Gets all the venues, given the URL arguments.
   * Updates the user controls, given the URL arguments.
   * Tries to get the distance.
   */
  beforeMount(): void {
    this.getCategories();
    this.updateVenuesFromURL(this.routerArgs);
    this.updateDataFromProps(this.routerArgs);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.getCurrentPosition,
        undefined,
        { enableHighAccuracy: true }
      );
    }
  },
  /**
   * Vue hook which triggeres before the route has updated.
   * Gets all the venues, given the URL arguments.
   * Updates the user controls, given the URL arguments.
   */
  beforeRouteUpdate(to: Route, from: Route, next: () => void) {
    if (to.path === "/venues" && isEmpty(to.params)) {
      this.updateVenuesFromURL(to.query);
      this.updateDataFromProps(to.query as GetVenueArgs);
    }
    next();
  },
  components: { Venue: VenueComponent },
  data: () => ({
    categories: [] as Category[],
    categoryId: undefined as number | undefined,
    city: "",
    desc: 0,
    geolocation: null as Position | null,
    maxCostRating: 4,
    minStarRating: 1,
    moreVenuesExist: false,
    name: "",
    selectedCategory: {} as Category,
    selectedSort: sortByOptions[0],
    sortByOptions,
    startIndex: 0,
    venues: [] as Venue[]
  }),
  methods: {
    getCategories(): void {
      axios
        .get(baseUrl + "/categories")
        .then(res => {
          this.categories = res.data;
          if (this.categoryId !== undefined) {
            this.selectedCategory = this.categories[this.categoryId - 1];
          } else {
            this.selectedCategory = {} as Category;
          }
        })
        .catch(err => console.error(err));
    },
    getCurrentPosition(position: Position): void {
      this.geolocation = position;
      this.sortByOptions.push({ queryKey: "DISTANCE", name: "Distance" });
    },
    async getVenues(params: GetVenueArgs): Promise<void> {
      this.venues = [];
      if (toSafeInteger(params.minStarRating) === 0) {
        params.minStarRating = undefined;
      }

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
    moveBatch(value: number): void {
      // @ts-ignore
      this.$router.push({
        path: "venues",
        query: {
          ...this.routerArgs,
          startIndex: this.startIndex + value
        }
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
          categoryId:
            this.categoryId !== undefined ? this.categoryId : undefined,
          city: this.city || undefined,
          count: 11,
          maxCostRating: this.maxCostRating,
          minStarRating: this.minStarRating,
          myLatitude: latitude,
          myLongitude: longitude,
          q: this.name || undefined,
          reverseSort,
          sortBy: this.selectedSort.queryKey,
          startIndex: this.startIndex
        };

        // @ts-ignore
        this.$router.push({ path: "venues", query: params });
      } catch (err) {
        console.error(err);
      }
    },
    updateDataFromProps({
      startIndex,
      city,
      q,
      categoryId,
      minStarRating,
      maxCostRating,
      adminId,
      sortBy,
      reverseSort
    }: GetVenueArgs | { [key: string]: string }): void {
      this.startIndex = Number.parseInt(startIndex as string) || 0;
      this.name = q || "";
      this.city = city || "";

      if (categoryId !== undefined) {
        this.categoryId = toSafeInteger(categoryId);
      } else {
        this.categoryId = undefined;
        this.selectedCategory = {} as Category;
      }

      if (sortBy !== undefined) {
        this.selectedSort =
          this.sortByOptions.find(el => el.queryKey === sortBy) ||
          this.sortByOptions[0];
        if (this.selectedSort.queryKey === "STAR_RATING") {
          this.desc = Boolean(reverseSort) ? 0 : 1;
        } else if (
          this.selectedSort.queryKey === "COST_RATING" ||
          this.selectedSort.queryKey === "DISTANCE"
        ) {
          this.desc = Boolean(reverseSort) ? 1 : 0;
        }
      } else {
        this.selectedSort = this.sortByOptions[0];
        this.desc = 1;
      }

      this.minStarRating =
        minStarRating !== undefined ? toSafeInteger(minStarRating) : 0;
      this.maxCostRating =
        maxCostRating !== undefined ? toSafeInteger(maxCostRating) : 4;

      // TODO: adminId
    },
    updateSelectedCategory(e?: Category): void {
      this.categoryId = e ? e.categoryId : undefined;
    },
    updateVenuesFromURL(routerArgs: GetVenueArgs): void {
      if (!isEmpty(routerArgs)) {
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
        } = routerArgs;

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
        } else {
          this.getVenues({});
        }
      } else {
        this.getVenues({});
      }
    }
  },
  props: {
    routerArgs: {
      type: Object as () => GetVenueArgs
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
