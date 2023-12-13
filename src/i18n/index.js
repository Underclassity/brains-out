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
      startAgain: "Start Again",
      continue: "Continue",

      or: "or",

      drop: "Drop",

      yes: "Yes",
      no: "No",
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
      startAgain: "Начать заново",
      continue: "Продолжить",

      or: "или",

      drop: "Уронить",

      yes: "Да",
      no: "Нет",
    },
  },
});

export default i18n;
