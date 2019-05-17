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
            <p class="subheading label">Email:</p>
            <p class="subheading value">{{ email }}</p>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Given name:</p>
            <div class="value">
              <v-layout row>
                <v-btn flat icon color="primary" @click="editGivenName">
                  <v-icon v-if="editingGivenName">save</v-icon>
                  <v-icon v-else class="flipped-icon">edit</v-icon>
                </v-btn>
                <v-text-field
                  v-model="givenName"
                  :rules="givenNameRules"
                  :counter="userMaximums.givenName"
                  label="Given name"
                  required
                  :disabled="!editingGivenName"
                />
              </v-layout>
            </div>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Family name:</p>
            <div class="value">
              <v-layout row>
                <v-btn flat icon color="primary" @click="editFamilyName">
                  <v-icon v-if="editingFamilyName">save</v-icon>
                  <v-icon v-else class="flipped-icon">edit</v-icon>
                </v-btn>
                <v-text-field
                  v-model="familyName"
                  :rules="familyNameRules"
                  :counter="userMaximums.givenName"
                  label="Family name"
                  required
                  :disabled="!editingFamilyName"
                />
              </v-layout>
            </div>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Password:</p>
            <div class="value">
              <v-layout row>
                <v-btn :disabled="editingPassword" flat icon color="primary" @click="editPassword">
                  <v-icon v-if="!editingPassword" class="flipped-icon">edit</v-icon>
                </v-btn>
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  :counter="userMaximums.password"
                  label="Password"
                  required
                  :disabled="!editingPassword"
                />
              </v-layout>
            </div>
          </div>

          <v-divider/>

          <div class="tile" v-if="editingPassword" transition="slide-x-transition">
            <p class="subheading label">Password:</p>
            <div class="value">
              <v-layout row>
                <v-btn v-if="editingPassword" flat icon color="primary" @click="editPassword">
                  <v-icon>save</v-icon>
                </v-btn>
                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  :counter="userMaximums.password"
                  label="Confirm password"
                  required
                  :disabled="!editingPassword"
                />
              </v-layout>
            </div>
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
    editingGivenName: false,
    familyName: "",
    editingFamilyName: false,
    email: "",
    password: "",
    confirmPassword: "",
    editingPassword: false,
    givenNameRules,
    familyNameRules,
    passwordRules: [],
    confirmPasswordRules: []
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
    },
    editGivenName() {
      this.editingGivenName = !this.editingGivenName;
    },
    editFamilyName() {
      this.editingFamilyName = !this.editingFamilyName;
    },
    editPassword() {
      this.editingPassword = !this.editingPassword;
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

/* Credit to https://codepen.io/anon/pen/VqPRyp */
.flipped-icon {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
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
