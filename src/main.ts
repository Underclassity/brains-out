import mitt from "mitt";

import { VTweakpane } from "v-tweakpane";

import { createApp } from "vue";

import App from "./App.vue";

import i18n from "./i18n/index.js";
import store from "./store/index.js";

const app = createApp(App).use(store).use(i18n);

app.component("VTweakpane", VTweakpane);

const emitter = mitt();

app.config.globalProperties.emitter = emitter;

app.mount("#app");
