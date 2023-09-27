import { mapState } from "vuex";

import log from "../../helpers/log.js";
import sleep from "../../helpers/sleep.js";

export default {
  name: "AchievementPopup",

  data() {
    return {
      isShow: false,

      id: false,
    };
  },

  computed: {
    ...mapState(["achievements"]),

    item() {
      return this.achievements[this.id];
    },
  },

  methods: {
    async openAchievement() {
      log("Show achievement popup");
      this.isShow = true;
      await sleep(2000);
      this.isShow = false;
      this.id = false;
    },

    closeAchievement() {
      log("Close achievement popup");
      this.isShow = false;
    },

    triggerAchievement() {
      log("Trigger achievement popup");
      if (this.isShow) {
        this.closeAchievement();
      } else {
        this.openAchievement;
      }
    },

    async addAchievement(id) {
      const isAdd = await this.$store.dispatch("addAchievement", id);

      if (isAdd) {
        this.id = id;
        this.openAchievement();
      }
    },
  },

  mounted() {
    this.emitter.on("triggerAchievement", this.triggerAchievement);
    this.emitter.on("addAchievement", this.addAchievement);
  },

  beforeUnmount() {
    this.emitter.off("triggerAchievement", this.triggerAchievement);
    this.emitter.off("addAchievement", this.addAchievement);
  },
};
