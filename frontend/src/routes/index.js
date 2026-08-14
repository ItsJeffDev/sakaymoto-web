import { createRouter, createWebHistory } from "vue-router";

import Home from "../App.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to) => {
//   const loggedIn = false; // replace with your auth logic

//   if (to.meta.requiresAuth && !loggedIn) {
//     return "/login";
//   }
// });

export default router;
