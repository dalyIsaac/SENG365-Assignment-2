<template>
  <v-layout align-start justify-start column fill-height>
    <h1>Hello {{ familyName }}, {{ givenName }}</h1>

    <v-container grid-list-xl fluid>
      <v-card class="full-width">
        <div class="tile">
          <p class="label">Username:</p>
          <p class="value">{{ username }}</p>
        </div>

        <div class="tile">
          <p class="label">Given name:</p>
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

        <div class="tile">
          <p class="label">Family name:</p>
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

        <div class="tile">
          <p class="label">Email:</p>
          <p class="value">{{ email }}</p>
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
