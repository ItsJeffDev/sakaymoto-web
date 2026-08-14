import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import reveal from './directives/reveal'
import router from "./routes/index.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createApp(App).use(router).directive('reveal', reveal).mount("#app");
