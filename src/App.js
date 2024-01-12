import { mapState } from "vuex";

import AchievementPopup from "./components/AchievementPopup/AchievementPopup.vue";
import MainScreen from "./components/MainScreen/MainScreen.vue";

export default {
  name: "App",

  components: {
    AchievementPopup,
    MainScreen,
  },

  computed: {
    ...mapState(["locale", "theme", "themes"]),
  },

  methods: {
    changeLocale(locale) {
      document.body.setAttribute("lang", locale);
    },

    updateThemeClass() {
      this.themes.forEach((theme) => {
        document.body.classList.remove(`theme-${theme}`);
      });

      document.body.classList.add(`theme-${this.theme}`);
    },
  },

  watch: {
    theme() {
      this.updateThemeClass();
    },
  },

  beforeMount() {
    this.changeLocale(this.locale);

    this.emitter.on("changeLocale", this.changeLocale);

    this.updateThemeClass();
  },
};
