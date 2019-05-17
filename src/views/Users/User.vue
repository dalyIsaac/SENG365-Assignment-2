<template>
  <v-layout align-start justify-start column fill-height>
    <h1>
      <span v-if="email">Hello</span>
      {{ familyName }}, {{ givenName }}
    </h1>

    <v-container grid-list-xl fluid>
      <v-card class="full-width">
        <div class="tile">
          <p class="subheading label">Username:</p>
          <p class="subheading value">{{ username }}</p>
        </div>

        <v-divider/>

        <div v-if="email">
          <div class="tile">
            <p class="subheading label">Given name:</p>
            <div class="value">
              <v-text-field
                v-model="givenName"
                :rules="givenNameRules"
                :counter="userMaximums.givenName"
                label="Given name"
                required
                :disabled="!editingMode"
              />
            </div>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Family name:</p>
            <div class="value">
              <v-text-field
                v-model="familyName"
                :rules="familyNameRules"
                :counter="userMaximums.givenName"
                label="Family name"
                required
                :disabled="!editingMode"
              />
            </div>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Email:</p>
            <p class="subheading value">{{ email }}</p>
          </div>
        </div>

        <div v-else>
          <div class="tile">
            <p class="subheading label">Given name:</p>
            <p class="subheading value">{{ givenName }}</p>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Family name:</p>
            <p class="subheading value">{{ familyName }}</p>
          </div>
        </div>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";

import { familyNameRules, givenNameRules, userMaximums } from "@/model/User";

export default Vue.extend({
  beforeMount() {
    this.getUser();
  },
  props: {
    id: { type: String }
  },
  data: () => ({
    userMaximums,
    username: "",
    givenName: "",
    familyName: "",
    email: "",
    editingMode: false,
    givenNameRules,
    familyNameRules
  }),
  methods: {
    getUser() {
      Vue.axiosAuthorized()
        .get("/users/" + this.id)
        .then(res => {
          this.username = res.data.username;
          this.givenName = res.data.givenName;
          this.familyName = res.data.familyName;

          // if this email is populated, then we know we're viewing ourselves,
          // per the API spec.
          this.email = res.data.email;
        });
    }
  }
});
</script>

<style scoped>
.tile {
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 16px;
}

.label {
  grid-column: 1;
  margin: 0;
  padding: 0;
}

.value {
  grid-column: 2;
  text-align: right;
  margin: 0;
  padding: 0;
}
</style>
