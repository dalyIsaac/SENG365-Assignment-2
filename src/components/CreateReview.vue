<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn fab bottom right fixed dark large class="ma-4" color="primary" v-on="on">
          <v-icon dark>rate_review</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Write a review</v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-layout align-center justify-start column fill-height>
              <v-flex xs-12 class="full-width">
                <v-textarea
                  v-model="reviewBody"
                  :counter="maximums.reviewBody"
                  :rules="reviewBodyRules"
                  label="Write your review here"
                  required
                  box
                  auto-grow
                />
              </v-flex>

              <v-flex xs-12 class="full-width">
                <v-slider
                  v-model="starRating"
                  always-dirty
                  hint="Star rating"
                  min="1"
                  max="5"
                  :tick-labels="[1, 2, 3, 4, 5]"
                  thumb-label
                  persistent-hint
                  ticks="always"
                  tick-size="3"
                  class="mr-4"
                />
              </v-flex>

              <v-flex xs-12 class="full-width">
                <v-slider
                  v-model="costRating"
                  always-dirty
                  hint="Cost rating"
                  min="0"
                  max="4"
                  thumb-label
                  persistent-hint
                  ticks="always"
                  :tick-labels="['Free', '$', '$$', '$$$', '$$$$']"
                  tick-size="3"
                  class="mr-4"
                  v-bind:style="{minWidth: '300px'}"
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>

        <v-divider/>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" :disabled="!valid" flat @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar :value="errorSnackbar" color="error" :timeout="0">
      {{ error }}
      <v-btn dark flat @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const maximums = {
  reviewBody: 1024
};

export default Vue.extend({
  props: {
    venueId: { type: String }
  },
  data: () => ({
    maximums,
    error: "",
    errorSnackbar: false,
    valid: false,
    dialog: false,
    reviewBody: "",
    reviewBodyRules: [
      (v: string) => !!v || "The review body cannot be empty",
      (v: string) =>
        v.length <= maximums.reviewBody ||
        `The review must be less than ${maximums.reviewBody} characters`
    ],
    starRating: 1,
    costRating: 0
  }),
  methods: {
    submit() {
      const data = {
        reviewBody: this.reviewBody,
        starRating: this.starRating,
        costRating: this.costRating
      };
      Vue.axiosAuthorized()
        .post(`/venues/${this.venueId}/reviews`, data)
        .catch(error => {
          this.error = error.response ? error.response.statusText : error;
          this.errorSnackbar = true;
        })
        .finally(() => (this.dialog = false));
    }
  }
});
</script>
