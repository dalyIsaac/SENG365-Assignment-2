import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "home" */ "./views/Home.vue")
    },
    {
      name: "allVenues",
      path: "/venues",
      component: () =>
        import(/* webpackChunkName: "venues" */ "./views/Venues.vue"),
      props: ({ query }) => {
        const { count, ...routerArgs } = query;
        return { routerArgs };
      }
    },
    {
      name: "individualVenue",
      path: "/venues/:id",
      component: () =>
        import(/* webpackChunkName: "venue" */ "./views/Venue.vue"),
      props: ({ params }) => ({ id: params.id })
    },
    {
      name: "signup",
      path: "/signup",
      component: () =>
        import(/* webpackChunkName: "signup" */ "./views/SignUp.vue")
    },
    {
      name: "login",
      path: "/login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      name: "Invalid",
      path: "/Invalid",
      component: () =>
        import(/* webpackChunkName: "Invalid") */ "./views/Invalid.vue")
    },
    {
      path: "*",
      redirect: "/Invalid"
    }
  ]
});
export default router;

const bannedRoutes = {
  loggedIn: ["login", "signup"],
  loggedOut: []
};

router.beforeEach((to, from, next) => {
  const loggedIn = Vue.loggedIn();
  if (loggedIn && bannedRoutes.loggedIn.indexOf(to.name!) !== -1) {
    next("/");
  } else if (bannedRoutes.loggedOut.indexOf(to.name!) !== -1) {
    next("/");
  } else {
    next();
  }
});
