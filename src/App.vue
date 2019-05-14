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
        <router-view @change="alert('Hello')"></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

interface MenuItem {
  icon: string;
  text: string;
  route: string;
}

interface Divider {
  divider: boolean;
}

export default Vue.extend({
  beforeMount() {
    this.updateItems();
  },
  watch: {
    $route(to, from) {
      this.updateItems();
    }
  },
  data: () => ({
    drawer: null,
    loggedOutItems: [
      { icon: "person_add", text: "Sign up", route: "/signup" },
      { icon: "person", text: "Login", route: "/login" }
    ],
    loggedInItems: [{ icon: "stop", text: "Sign out", route: "/signout" }],
    commonItems: [
      { icon: "home", text: "Home", route: "/" },
      { icon: "pin_drop", text: "Venues", route: "/venues" },
      { divider: true }
    ],
    items: [] as Array<MenuItem | Divider>
  }),
  methods: {
    navigateTo(path: string): void {
      this.$router.push(path);
    },
    updateItems(): void {
      if (Vue.loggedIn()) {
        this.items = [...this.commonItems, ...this.loggedInItems];
      } else {
        this.items = [...this.commonItems, ...this.loggedOutItems];
      }
    }
  },
  props: {
    source: String
  }
});
</script>
