// import { createRouter, createWebHistory } from 'vue-router/auto'
// import { routes } from 'vue-router/auto-routes'

import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/index.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/account",
    name: "account",
    component: () => import("@/pages/account.vue"),
  },
  {
    path: "/write",
    name: "write",
    component: () => import("@/pages/write.vue"),
  },
  {
    path: "/favorite",
    name: "favorite",
    component: () => import("@/pages/favorite.vue"),
  },
  {
    path: "/suggested",
    name: "suggested",
    component: () => import("@/pages/suggested.vue"),
  },
  {
    path: "/blog/:id",
    name: "Article",
    component: () => import("@/pages/blog/[id].vue"),
  }
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;