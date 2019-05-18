<template>
  <v-form v-model="valid" ref="form" class="full-width">
    <h1>Sign in</h1>
    <v-layout row wrap>
      <v-flex pa-2 sm12 md6 lg4 xl3 class="full-width">
        <v-text-field v-model="username" :rules="usernameRules" label="Username or email" required/>
      </v-flex>

      <v-flex pa-2 sm12 md6 lg4 xl3 class="full-width">
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          class="input-group--focused"
          required
          type="password"
        />
      </v-flex>

      <v-layout class="full-width" align-end justify-start column fill-height>
        <p v-if="errorText" class="red--text mr-2">{{ errorText }}</p>
        <v-btn class="mr-2" @click="submit" :disabled="!valid">Submit</v-btn>
      </v-layout>
    </v-layout>
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

<style scoped>
.full-width {
  width: 100%;
}
</style>
