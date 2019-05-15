<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <v-layout>
        <v-flex xs12 md4>
          <v-text-field
            v-model="venueName"
            :rules="venueNameRules"
            :counter="maximums.venueName"
            label="Username"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-select
            class="mr-4"
            :items="categories"
            item-text="categoryName"
            label="Category"
            :clearable="true"
            return-object
            v-model="selectedCategory"
            v-on:change="updateSelectedCategory"
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="city"
            :rules="cityRules"
            :counter="maximums.city"
            label="City"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="shortDescription"
            :rules="shortDescriptionRules"
            :counter="maximums.shortDescription"
            label="Short description"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="longDescription"
            :counter="maximums.longDescription"
            :rules="longDescriptionRules"
            label="Long description"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="address"
            :rules="addressRules"
            :counter="maximums.address"
            label="Address"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="latitude"
            :rules="latitudeRules"
            :counter="maximums.latitude"
            label="Latitude"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="longitude"
            :rules="longitudeRules"
            :counter="maximums.longitude"
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
import { Category } from "@/model/Category";

const maximums = {
  venueName: 64,
  city: 128,
  shortDescription: 128,
  longDescription: 2048,
  address: 256
};

export default Vue.extend({
  data: () => ({
    maximums,
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
    venueNameRules: [],
    cityRules: [],
    shortDescriptionRules: [],
    longDescriptionRules: [],
    addressRules: [],
    latitudeRules: [],
    longitudeRules: []
  }),
  methods: {
    updateSelectedCategory(e?: Category): void {
      this.categoryId = e ? e.categoryId : undefined;
    },
    submit() {
      // TODO
    }
  }
});
</script>
