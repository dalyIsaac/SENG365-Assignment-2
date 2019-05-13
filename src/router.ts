import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Home.vue")
    },
    {
      name: "allVenues",
      path: "/venues",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Venues.vue"),
      props: ({ query }) => {
        const { count, ...routerArgs } = query;
        return { routerArgs };
      }
    },
    {
      name: "individualVenue",
      path: "/venues/:id",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Venue.vue"),
      props: ({ params }) => ({ params })
    }
  ]
});
