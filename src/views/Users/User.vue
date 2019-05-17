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
                <v-btn flat :disabled="!givenNameValid" icon color="primary" @click="editGivenName">
                  <v-icon v-if="editingGivenName">save</v-icon>
                  <v-icon v-else class="flipped-icon">edit</v-icon>
                </v-btn>
                <v-form v-model="givenNameValid">
                  <v-text-field
                    v-model="givenName"
                    :rules="nameRules"
                    :counter="userMaximums.name"
                    label="Given name"
                    required
                    :disabled="!editingGivenName"
                  />
                </v-form>
              </v-layout>
            </div>
          </div>

          <v-divider/>

          <div class="tile">
            <p class="subheading label">Family name:</p>
            <div class="value">
              <v-layout row>
                <v-btn
                  flat
                  :disabled="!familyNameValid"
                  icon
                  color="primary"
                  @click="editFamilyName"
                >
                  <v-icon v-if="editingFamilyName">save</v-icon>
                  <v-icon v-else class="flipped-icon">edit</v-icon>
                </v-btn>
                <v-form v-model="familyNameValid">
                  <v-text-field
                    v-model="familyName"
                    :rules="nameRules"
                    :counter="userMaximums.name"
                    label="Family name"
                    required
                    :disabled="!editingFamilyName"
                  />
                </v-form>
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
                  @input="validatePassword"
                  class="input-group--focused"
                  :disabled="!editingPassword"
                  type="password"
                />
              </v-layout>
            </div>
          </div>

          <v-divider/>

          <div class="tile" v-if="editingPassword" transition="slide-x-transition">
            <p class="subheading label">Password:</p>
            <div class="value">
              <v-layout row>
                <v-btn
                  v-if="editingPassword"
                  :disabled="!passwordValid"
                  flat
                  icon
                  color="primary"
                  @click="editPassword"
                >
                  <v-icon>save</v-icon>
                </v-btn>
                <v-form v-model="passwordValid">
                  <v-text-field
                    v-model="confirmPassword"
                    :error-messages="confirmPasswordError"
                    :rules="[validateConfirmPassword]"
                    :counter="userMaximums.password"
                    label="Confirm password"
                    required
                    class="input-group--focused"
                    :disabled="!editingPassword"
                    type="password"
                  />
                </v-form>
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
import { isBoolean } from "lodash";
import Vue from "vue";

import { nameRules, passwordRules ,userMaximums } from "@/model/User";

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
    givenNameValid: true,
    editingGivenName: false,
    familyName: "",
    familyNameValid: true,
    editingFamilyName: false,
    email: "",
    password: "",
    confirmPassword: "",
    passwordValid: true,
    editingPassword: false,
    nameRules,
    passwordRules,
    confirmPasswordRules: [],
    confirmPasswordError: [] as Array<string | boolean>
  }),
  methods: {
    async getUser(props?: Array<"givenName" | "familyName">) {
      const res = await Vue.axiosAuthorized().get("/users/" + this.id);

      if (props) {
        for (const key of props) {
          this[key] = res.data[key];
        }
      } else {
        this.username = res.data.username;
        this.givenName = res.data.givenName;
        this.familyName = res.data.familyName;

        // if this email is populated, then we know we're viewing ourselves,
        // per the API spec.
        this.email = res.data.email;
      }
    },
    async editGivenName() {
      if (this.editingGivenName && this.givenNameValid) {
        this.editingGivenName = false;
        await Vue.axiosAuthorized().patch("/users/" + this.id, {
          givenName: this.givenName
        });
        this.getUser(["givenName"]);
      } else {
        this.editingGivenName = true;
      }
    },
    async editFamilyName() {
      if (this.editingFamilyName && this.familyNameValid) {
        this.editingFamilyName = false;
        await Vue.axiosAuthorized().patch("/users/" + this.id, {
          familyName: this.familyName
        });
        this.getUser(["familyName"]);
      } else {
        this.editingFamilyName = true;
      }
    },
    async editPassword() {
      if (this.editingPassword && this.password) {
        this.editingPassword = false;
        await Vue.axiosAuthorized().patch("/users/" + this.id, {
          password: this.password
        });
      } else {
        this.editingPassword = true;
      }
    },
    validatePassword() {
      this.validateConfirmPassword(this.confirmPassword);
    },
    validateConfirmPassword(v: string) {
      const status = v === this.password || "The passwords do not match";
      this.confirmPasswordError = isBoolean(status) ? [] : [status];
      return status;
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
