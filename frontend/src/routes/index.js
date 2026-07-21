import { createRouter, createWebHistory } from "vue-router";

// import Home from "../views/Home.vue";
// import Motorcycles from "../views/Motorcycles.vue";
// import Booking from "../views/Booking.vue";
// import Login from "../views/Login.vue";

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home
//   },
//   {
//     path: "/motorcycles",
//     name: "Motorcycles",
//     component: Motorcycles
//   },
//   {
//     path: "/booking",
//     name: "Booking",
//     component: Booking
//   },
//   {
//     path: "/login",
//     name: "Login",
//     component: Login
//   }
// ];

const router = createRouter({
  history: createWebHistory(),
  routes
});


// router.beforeEach((to) => {
//   const loggedIn = false; // replace with your auth logic

//   if (to.meta.requiresAuth && !loggedIn) {
//     return "/login";
//   }
// });

export default router;