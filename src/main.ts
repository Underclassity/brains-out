import mitt from "mitt";

import { createApp } from "vue";

import App from "./App.vue";

import store from "./store/index.js";
import "./style.css";

const app = createApp(App).use(store);

const emitter = mitt();

app.config.globalProperties.emitter = emitter;

app.mount("#app");
