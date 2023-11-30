import App from "./App.vue";
import { router } from "./router";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { OhVueIcon } from "oh-vue-icons";

import "@/design/icons";
import Typography from "./components/Typography.vue";
import Picture from "./components/Picture.vue";

const pinia = createPinia();

createApp(App)
  .provide("backendUrl", import.meta.env.VITE_BACKEND_URL)
  .component("Typography", Typography)
  .component("Picture", Picture)
  .component("Icon", OhVueIcon)
  .use(pinia)
  .use(router)
  .mount("#app");
