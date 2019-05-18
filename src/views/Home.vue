<template>
  <div>
    You really shouldn't be looking at this. Please stop and
    <router-link to="/venues">go look at some venues</router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  beforeMount() {
    this.$router.push("/venues");
  }
});
</script>
