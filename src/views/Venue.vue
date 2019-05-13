<template>
  <v-container>{{ params }}</v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["params"]
});
</script>
