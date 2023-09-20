import { mapState } from "vuex";

import log from "../../helpers/log.js";

import logoSrc from "../../assets/img/green-logo.png";

export default {
  name: "MenuScreen",

  props: {
    isLogo: {
      type: Boolean,
      default: false,
    },

    isAccepted: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      logoSrc,

      flags: {
        menu: false,
        new: false,
        settings: false,
        controls: false,
        credits: false,
        continue: false,
        end: false,
      },

      isMenu: false,
      isNewGame: false,
      isSettings: false,
      isControls: false,
      isCredits: false,
      isContinue: false,
      isEnd: false,

      isStarted: false,

      isDev: false,
      isControls: false,

      version: import.meta.env.VITE_APP_VERSION,
    };
  },

  computed: {
    ...mapState([
      "volume",
      "fxVolume",

      "pitSize",
      "pitSizes",

      "blocksTypeOptions",
      "blocksType",

      "settingsSpeed",
      "speedStep",
      "minSpeed",
      "maxSpeed",
    ]),

    isShow() {
      let isShow = false;

      for (const id in this.flags) {
        if (this.flags[id]) {
          isShow = true;
        }
      }

      return isShow;
    },
  },

  methods: {
    resetFlags() {
      for (const id in this.flags) {
        this.flags[id] = false;
      }
    },

    openStartMenu() {
      this.resetFlags();
      this.flags.menu = true;

      log("Open start menu call", this.isShow);
    },

    openMenu() {
      this.resetFlags();
      this.flags.new = true;

      log("Open menu call", this.isShow);
    },

    closeMenu() {
      this.resetFlags();

      this.$emit("back-to-game");

      log("Close menu call", this.isShow);
    },

    newGameCall() {
      this.resetFlags();
      this.flags.new = true;

      log("New game call", this.isShow);
    },

    newGameCallForce() {
      this.isStarted = false;
      this.newGameCall();
    },

    settingsCall() {
      this.resetFlags();
      this.flags.settings = true;

      log("Settings call", this.isShow);
    },

    controlsCall() {
      this.resetFlags();
      this.flags.controls = true;

      log("Controls call", this.isShow);
    },

    creditsCall() {
      this.resetFlags();
      this.flags.credits = true;

      log("Credits call", this.isShow);
    },

    endCall() {
      this.resetFlags();
      this.flags.end = true;

      this.isStarted = false;

      log("End call", this.isShow);
    },

    continueCall() {
      this.resetFlags();
      this.flags.continue = true;

      log("Continue call", this.isShow);
    },

    startAgainCall() {
      if (!this.isStarted) {
        this.isStarted = true;
      }

      this.resetFlags();

      this.$emit("new-game");

      log("Start again call", this.isShow);
    },

    back() {
      if (this.isEnd) {
        this.isStarted = false;
      }

      this.resetFlags();
      this.flags.menu = this.isStarted ? false : true;

      if (this.isStarted) {
        this.$emit("back-to-game");
      }

      log("Back call", this.isShow);
    },

    backToMenu() {
      this.openStartMenu();

      this.isStarted = false;
      this.flags.end = false;

      log("Back to menu call", this.isShow);
    },

    playClick() {
      this.resetFlags();

      if (!this.isStarted) {
        this.isStarted = true;
      }

      this.$emit("new-game");

      log("Play click call", this.isShow);
    },

    prevPitSize() {
      this.$store.commit(
        "updatePitSize",
        this.pitSizes[this.pitSizes.indexOf(this.pitSize) - 1]
      );
    },

    nextPitSize() {
      this.$store.commit(
        "updatePitSize",
        this.pitSizes[this.pitSizes.indexOf(this.pitSize) + 1]
      );
    },

    prevBlockType() {
      this.$store.commit(
        "updateBlockType",
        this.blocksTypeOptions[
          this.blocksTypeOptions.indexOf(this.blocksType) - 1
        ]
      );
    },

    nextBlockType() {
      this.$store.commit(
        "updateBlockType",
        this.blocksTypeOptions[
          this.blocksTypeOptions.indexOf(this.blocksType) + 1
        ]
      );
    },

    prevSpeed() {
      this.$store.commit("updateSettingsSpeed", -this.speedStep);
    },

    nextSpeed() {
      this.$store.commit("updateSettingsSpeed", this.speedStep);
    },

    prevVolume() {
      this.$store.commit("updateVolume", -0.1);
    },

    nextVolume() {
      this.$store.commit("updateVolume", 0.1);
    },

    prevFxVolume() {
      this.$store.commit("updateFxVolume", -0.1);
    },

    nextFxVolume() {
      this.$store.commit("updateFxVolume", 0.1);
    },

    disableDevMode() {
      this.isDev = false;

      this.emitter.emit("updateDevMode", this.isDev);
    },

    enableDevMode() {
      this.isDev = true;

      this.emitter.emit("updateDevMode", this.isDev);
    },

    disableControls() {
      this.isControls = false;

      this.emitter.emit("updateControls", this.isControls);
    },

    enableControls() {
      this.isControls = true;

      this.emitter.emit("updateControls", this.isControls);
    },

    blurEvent() {
      if (this.isShow) {
        return false;
      }

      if (!this.isStarted) {
        return false;
      }

      if (this.isLogo || !this.isAccepted) {
        return false;
      }

      this.continueCall();
    },
  },

  watch: {
    isShow(newValue, oldValue) {
      if (newValue) {
        this.emitter.emit("openMenuScreen");
      } else {
        this.emitter.emit("closeMenuScreen");
      }
    },
  },

  mounted() {
    this.emitter.on("openMenu", this.continueCall);
    this.emitter.on("openEndMenu", this.endCall);
    this.emitter.on("openStartMenu", this.openStartMenu);

    window.addEventListener("blur", this.blurEvent);
  },

  beforeUnmount() {
    window.removeEventListener("blur", this.blurEvent);
  },
};
