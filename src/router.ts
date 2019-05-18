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
        import(/* webpackChunkName: "venues" */ "./views/Venues/Venues.vue"),
      props: ({ query }) => {
        const { count, ...routerArgs } = query;
        return { routerArgs };
      }
    },
    {
      name: "createVenue",
      path: "/venues/create",
      component: () =>
        import(
          /* webpackChunkName: "createVenue" */ "./views/Venues/ModifyVenue.vue"
        )
    },
    {
      name: "editVenue",
      path: "/venues/:id/edit",
      component: () =>
        import(
          /* webpackChunkName: "editVenue" */ "./views/Venues/ModifyVenue.vue"
        ),
      props: ({ params }) => ({ id: params.id })
    },
    {
      name: "individualVenue",
      path: "/venues/:id",
      component: () =>
        import(/* webpackChunkName: "venue" */ "./views/Venues/Venue.vue"),
      props: ({ params }) => ({ id: params.id })
    },
    {
      name: "signup",
      path: "/users/signup",
      component: () =>
        import(/* webpackChunkName: "signup" */ "./views/Users/SignUp.vue")
    },
    {
      name: "login",
      path: "/users/login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Users/Login.vue")
    },
    {
      path: "/users/logout",
      redirect: { name: "home" }
    },
    {
      name: "users",
      path: "/users/:id",
      component: () =>
        import(/* webpackChunkName: "users" */ "./views/Users/User.vue"),
      props: ({ params }) => ({ id: params.id })
    },
    {
      name: "invalid",
      path: "/invalid",
      component: () =>
        import(/* webpackChunkName: "Invalid") */ "./views/Invalid.vue")
    },
    {
      path: "*",
      redirect: "/invalid"
    }
  ]
});
export default router;

const bannedRoutes = {
  loggedIn: ["login", "signup"],
  loggedOut: ["createVenue", "editVenue"]
};

router.beforeEach((to, from, next) => {
  const loggedIn = Vue.isLoggedIn();
  if (loggedIn && bannedRoutes.loggedIn.indexOf(to.name!) !== -1) {
    next("/");
  } else if (!loggedIn && bannedRoutes.loggedOut.indexOf(to.name!) !== -1) {
    next("/");
  } else {
    next();
  }
});
