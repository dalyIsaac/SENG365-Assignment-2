<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <v-layout>
        <v-flex xs12 md4>
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            label="Username or email"
            required
          />
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
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

    <p v-if="errorText" class="red--text">{{ errorText }}</p>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    errorText: "",
    username: "",
    password: "",
    valid: false,
    usernameRules: [(v: string) => !!v || "Username is required"],
    passwordRules: [(v: string) => !!v || "Password is required"]
  }),
  methods: {
    async submit() {
      const result = await Vue.login({
        username: this.username,
        email: this.username,
        password: this.password
      });
      if (!result) {
        this.errorText = "Invalid username, email or password";
      } else {
        this.$router.push("/venues");
      }
    }
  }
});
</script>
