import { createI18n } from "../../node_modules/vue-i18n/dist/vue-i18n.esm-browser.prod.js";

import store from "../store/index.js";

const i18n = createI18n({
  locale: store.state.locale || "en",

  messages: {
    en: {
      newGame: "New game",
      practice: "Practice",
      settings: "Settings",
      howToPlay: "How to play",
      achievements: "Achievements",
      credits: "Credits",

      back: "Back",
      backToMenu: "Back to menu",
      next: "Next",
      play: "Play",

      or: "or",

      drop: "Drop",
    },

    ru: {
      newGame: "Новая игра",
      practice: "Практика",
      settings: "Настройки",
      howToPlay: "Как играть",
      achievements: "Достижения",
      credits: "О нас",

      back: "Назад",
      backToMenu: "Назад в меню",
      next: "Дальше",
      play: "Играть",

      or: "или",

      drop: "Уронить",
    },
  },
});

export default i18n;
