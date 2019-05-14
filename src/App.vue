<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed clipped class="grey lighten-4" app>
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-divider v-if="item.divider" :key="i" dark class="my-3"></v-divider>

          <v-list-tile v-else :key="i" @click="navigateTo(item.route)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="green" clipped-left app>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5">
        Venue
        <span class="font-weight-light">Advisor</span>
      </span>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content class="container">
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    drawer: null,
    items: [
      { icon: "home", text: "Home", route: "/" },
      { icon: "pin_drop", text: "Venues", route: "/venues" },
      { divider: true },
      { icon: "person_add", text: "Sign up", route: "/signup" },
      { icon: "settings", text: "Settings" }
    ]
  }),
  methods: {
    navigateTo(path: string): void {
      this.$router.push(path);
    }
  },
  props: {
    source: String
  }
});
</script>
