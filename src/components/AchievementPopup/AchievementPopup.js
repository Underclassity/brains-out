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
      if (this.id == "enable-gamepad") {
        return {
          title: "Gamepad connected",
        };
      }

      if (this.id == "disable-gamepad") {
        return {
          title: "Gamepad disconnected",
        };
      }

      return this.achievements[this.id];
    },
  },

  methods: {
    log() {
      return log(`[${this.$options.name}]:`, ...arguments);
    },

    async openAchievement() {
      this.log("Show achievement popup");
      this.isShow = true;
      await sleep(2000);
      this.isShow = false;
      this.id = false;
    },

    closeAchievement() {
      this.log("Close achievement popup");
      this.isShow = false;
    },

    triggerAchievement() {
      this.log("Trigger achievement popup");
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

    enableGamepad() {
      this.id = "enable-gamepad";
      this.openAchievement();
    },

    disableGamepad() {
      this.id = "disable-gamepad";
      this.openAchievement();
    },
  },

  mounted() {
    this.emitter.on("triggerAchievement", this.triggerAchievement);
    this.emitter.on("addAchievement", this.addAchievement);

    this.emitter.on("enableGamepad", this.enableGamepad);
    this.emitter.on("disableGamepad", this.disableGamepad);
  },

  beforeUnmount() {
    this.emitter.off("triggerAchievement", this.triggerAchievement);
    this.emitter.off("addAchievement", this.addAchievement);

    this.emitter.on("enableGamepad", this.enableGamepad);
    this.emitter.on("disableGamepad", this.disableGamepad);
  },
};
