<template>
  <v-container>
    <v-layout align-center justify-center column fill-height>
      <h1>Sorry, you can't go there.</h1>
      <v-btn @click="goHome">Go back to Home</v-btn>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    goHome() {
      this.$router.push("/");
    }
  }
});
</script>
