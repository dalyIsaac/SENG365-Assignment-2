<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <v-layout>
        <v-flex xs12 md4>
          <v-text-field
            v-model="venueName"
            :rules="venueRules.venueNameRules"
            :counter="venueMaximums.venueName"
            label="Venue name"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-select
            class="mr-4"
            :items="categories"
            item-text="categoryName"
            label="Category"
            return-object
            :rules="venueRules.categoryNameRules"
            v-model="selectedCategory"
            v-on:change="updateSelectedCategory"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="city"
            :rules="venueRules.cityRules"
            :counter="venueMaximums.city"
            label="City"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="shortDescription"
            :rules="venueRules.shortDescriptionRules"
            :counter="venueMaximums.shortDescription"
            label="Short description"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-container fluid grid-list-md>
            <v-textarea
              v-model="longDescription"
              :counter="venueMaximums.longDescription"
              :rules="venueRules.longDescriptionRules"
              label="Long description"
              required
              box
              auto-grow
            ></v-textarea>
          </v-container>
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="address"
            :rules="venueRules.addressRules"
            :counter="venueMaximums.address"
            label="Address"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="latitude"
            :rules="venueRules.longitudeRules"
            :counter="venueMaximums.latitude"
            label="Latitude"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="longitude"
            :rules="venueRules.latitudeRules"
            :counter="venueMaximums.longitude"
            label="Longitude"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-btn @click="submit" :disabled="!valid">Submit</v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <v-snackbar :value="errorSnackbar" color="error" :timeout="0">
      {{ error }}
      <v-btn dark flat @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { toNumber, isString, isEmpty } from "lodash";

import { Category } from "@/model/Category";
import { venueMaximums, venueRules } from "@/model/Venue";

export default Vue.extend({
  props: {
    id: { type: String }
  },
  beforeMount() {
    this.getCategories();
    // editing a venue
    if (isString(this.id)) {
      this.beforeMountEditVenue();
    }
  },
  data: () => ({
    venueMaximums,
    valid: false,
    error: "",
    errorSnackbar: false,
    venueName: "",
    categoryId: undefined as number | undefined,
    selectedCategory: {} as Category,
    categories: [] as Category[],
    city: "",
    shortDescription: "",
    longDescription: "",
    address: "",
    latitude: "",
    longitude: "",
    photos: [] as string[],
    venueRules,
    method: "post"
  }),
  methods: {
    async beforeMountEditVenue() {
      Vue.axiosAuthorized()
        .get("/venues/" + this.id)
        .then(res => {
          if (Vue.getUserId() !== res.data.admin.userId) {
            this.$router.push("/");
            return;
          }
          this.venueName = res.data.venueName;
          this.city = res.data.city;
          this.shortDescription = res.data.shortDescription;
          this.longDescription = res.data.longDescription;
          this.address = res.data.address;
          this.latitude = res.data.latitude;
          this.longitude = res.data.longitude;
          this.photos = res.data.photos;
          this.categoryId = res.data.category.categoryId;
          if (!isEmpty(this.categories)) {
            this.selectedCategory = this.categories[this.categoryId! - 1];
          }
          // Updates HTTP method to patch if editing
          this.method = "patch";
        })
        .catch(error => {
          console.error({ ...error });
          this.$router.push("/");
        });
    },
    getCategories(): void {
      Vue.axiosAuthorized()
        .get("/categories")
        .then(res => {
          this.categories = res.data;
          if (this.categoryId !== undefined) {
            this.selectedCategory = this.categories[this.categoryId - 1];
          } else {
            this.selectedCategory = {} as Category;
          }
        })
        .catch(err => {
          console.error({ ...err });
          this.error = "Couldn't retrieve the categories";
          this.errorSnackbar = true;
        });
    },
    updateSelectedCategory(e?: Category): void {
      this.categoryId = e ? e.categoryId : undefined;
    },
    async submit() {
      const data = {
        venueName: this.venueName,
        categoryId: this.categoryId,
        city: this.city,
        shortDescription: this.shortDescription,
        longDescription: this.longDescription,
        address: this.address,
        latitude: toNumber(this.latitude),
        longitude: toNumber(this.longitude)
      };

      try {
        // editing a venue
        if (isString(this.id)) {
          const url = `/venues/${this.id}`;
          await Vue.axiosAuthorized().patch(url, data);
          this.$router.push(url);
        } else {
          const res = await Vue.axiosAuthorized().post("/venues", data);
          const venueId = res.data.venueId;
          this.$router.push(`/venues/${venueId}`);
        }
      } catch (error) {
        if (error.response) {
          this.error = error.response.statusText;
        } else if (isString(error)) {
          this.error = error;
        } else {
          this.error = "Something bad happened (we know this isn't helpful)";
        }
        this.error = error.response ? error.response.statusText : error;
        this.errorSnackbar = true;
      }
    }
  }
});
</script>
