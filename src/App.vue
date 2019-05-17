<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed clipped class="grey lighten-4" app>
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-divider v-if="item.divider" :key="i" dark class="my-3"></v-divider>

          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="grey--text">{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click="child.click !== undefined ? child.click() : navigateTo(child.route)"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="grey--text">{{ child.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>

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
  "icon-alt"?: string;
  text: string;
  route?: string;
  children?: MenuItem[];
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
      { divider: true },
      { icon: "person_add", text: "Sign up", route: "/users/signup" },
      { icon: "person", text: "Login", route: "/users/login" }
    ],
    loggedInItems: [
      { divider: true },
      { icon: "playlist_add", text: "Create venue", route: "/venues/create" },
      {
        icon: "keyboard_arrow_up",
        "icon-alt": "keyboard_arrow_down",
        text: "Account",
        model: false,
        children: [
          { icon: "account_circle", text: "View account", route: "/users" },
          { icon: "stop", text: "Sign out", click: () => Vue.logout() }
        ]
      }
    ],
    commonItems: [
      { icon: "home", text: "Home", route: "/" },
      { icon: "pin_drop", text: "Venues", route: "/venues" }
    ],
    items: [] as Array<MenuItem | Divider>
  }),
  methods: {
    navigateTo(path: string): void {
      this.$router.push(path);
    },
    updateItems(): void {
      if (Vue.isLoggedIn()) {
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
