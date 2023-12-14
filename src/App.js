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
    ...mapState(["locale"]),
  },

  methods: {
    changeLocale(locale) {
      document.body.setAttribute("lang", locale);
    },
  },

  beforeMount() {
    this.changeLocale(this.locale);

    this.emitter.on("changeLocale", this.changeLocale);
  },
};
