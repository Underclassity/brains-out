import { createI18n } from "vue-i18n/dist/vue-i18n.esm-browser.prod";

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

      acceptedBugsDesc:
        "This game is in a state of development and may contain bugs, that can lead to some unexpected behavior. By pressing «Play», you accept any scenario that can happen. Otherwise, close this page.",

      back: "Back",
      backToMenu: "Back to menu",
      next: "Next",
      play: "Play",
    },

    ru: {
      newGame: "Новая игра",
      practice: "Практика",
      settings: "Настройки",
      howToPlay: "Как играть",
      achievements: "Достижения",
      credits: "О нас",

      acceptedBugsDesc:
        "Эта игра находится в стадии разработки и может содержать ошибки, которые могут привести к неожиданному поведению. Нажимая «Играть», вы принимаете любой сценарий, который может произойти. В противном случае закройте эту страницу.",

      back: "Назад",
      backToMenu: "Назад в меню",
      next: "Дальше",
      play: "Играть",
    },
  },
});

export default i18n;
