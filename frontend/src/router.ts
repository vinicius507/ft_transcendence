import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import LobbyView from "./views/LobbyView.vue";
import AboutView from "./views/AboutView.vue";

import GameViewVue from "./views/lobby/GameView.vue";
import ProfileViewVue from "./views/lobby/ProfileView.vue";

export default function () {
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: "/:catchAll(.*)",
        name: "not-found",
        component: () => import("./views/NotFoundView.vue"),
      },
      {
        path: "/",
        name: "home",
        component: HomeView,
      },
      {
        path: "/auth/login",
        name: "login",
        component: () => import("./views/LoginView.vue"),
      },
      {
        path: "/about",
        name: "about",
        component: AboutView,
      },
      {
        path: "/lobby",
        name: "lobby",
        component: LobbyView,
        redirect: { name: "profile" },

        children: [
          {
            path: "game",
            name: "game",
            component: GameViewVue,
          },
          {
            path: "profile",
            name: "profile",
            component: ProfileViewVue,
          },
        ],
      },
    ],
  });
}