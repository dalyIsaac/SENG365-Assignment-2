<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <v-layout>
        <v-flex xs12 md4>
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            :counter="maximums.username"
            label="Username"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="givenName"
            :rules="nameRules"
            :counter="maximums.name"
            label="Given name"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="familyName"
            :rules="nameRules"
            :counter="maximums.name"
            label="Family name"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="email"
            :counter="maximums.name"
            :rules="emailRules"
            label="Email"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :counter="maximums.password"
            label="Password"
            class="input-group--focused"
            @input="validatePassword"
            required
            type="password"
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="confirmPassword"
            :error-messages="confirmPasswordError"
            :rules="[validateConfirmPassword]"
            :counter="maximums.password"
            label="Confirm password"
            class="input-group--focused"
            required
            type="password"
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
import axios from "axios";
import { isBoolean, isString } from "lodash";
import isemail from "isemail";

import { baseUrl } from "@/common";
import { nameRules, passwordRules } from "@/model/User";

const maximums = {
  username: 64,
  name: 128,
  password: 256
};

export default Vue.extend({
  data: () => ({
    maximums,
    error: "",
    errorSnackbar: false,
    username: "",
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmPasswordError: [] as Array<string | boolean>,
    usernameRules: [
      (v: string) => !!v || "Username is required",
      (v: string) =>
        v.length <= maximums.username ||
        `Username must be less than ${maximums.username} characters`,
      (v: string) =>
        v.match(/^[a-z0-9]+$/i) !== null || "Username must be alphanumeric"
    ],
    nameRules,
    emailRules: [(v: string) => isemail.validate(v) || "Invalid email"],
    passwordRules,
    valid: false
  }),
  methods: {
    validatePassword() {
      this.validateConfirmPassword(this.confirmPassword);
    },
    validateConfirmPassword(v: string) {
      const status = v === this.password || "The passwords do not match";
      this.confirmPasswordError = isBoolean(status) ? [] : [status];
      return status;
    },
    async submit() {
      axios
        .post(baseUrl + "/users", {
          username: this.username,
          email: this.email!,
          givenName: this.givenName,
          familyName: this.familyName,
          password: this.password
        })
        .then(async res => {
          const result = await Vue.login({
            username: this.username,
            email: this.email,
            password: this.password
          });
          this.$router.push("/");
          if (!result) {
            this.error =
              "Sorry, we couldn't log you in (we know this isn't helpful)";
          }
        })
        .catch(err => {
          if (err.response) {
            this.error = err.response.statusText;
          } else if (isString(err)) {
            this.error = err;
          } else {
            this.error = "Something bad happened (we know this isn't helpful)";
          }
          this.error = err.response ? err.response.statusText : err;
          this.errorSnackbar = true;
        });
    }
  }
});
</script>
