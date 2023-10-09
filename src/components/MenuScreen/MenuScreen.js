import { mapState } from "vuex";

import assets from "../../store/assets.js";

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
        achievements: false,
        end: false,
      },

      isMenu: false,
      isNewGame: false,
      isSettings: false,
      isCredits: false,
      isContinue: false,
      isEnd: false,

      isStarted: false,

      isShare: "share" in navigator,

      assets,

      refs: {
        menu: ["newGame", "settings", "controls", "achievements", "credits"],
        new: ["pit", "blocksType", "speed", "back", "play"],
        credits: ["back"],
        controls: ["back"],
        settings: [
          "volume",
          "fxVolume",
          "dev",
          "vibration",
          "controls",
          "back",
        ],
        end: ["new", "back", "share"],
        continue: ["new", "continue", "back"],
        achievements: ["back"],
      },

      lastFocused: {},

      focused: false,

      isDevApproved: !import.meta.env?.VITE_IS_DEV_MODE,
    };
  },

  computed: {
    ...mapState([
      "volume",
      "fxVolume",

      "score",

      "pitSize",
      "pitSizes",

      "blocksTypeOptions",
      "blocksType",

      "settingsSpeed",
      "speedStep",
      "minSpeed",
      "maxSpeed",

      "version",

      "isDev",
      "isControls",
      "isVibration",

      "isGamepad",

      "achievements",
      "userAchievements",
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

    currentView() {
      let currentView = undefined;

      for (const id in this.refs) {
        if (this.flags[id]) {
          currentView = id;
        }
      }

      return currentView;
    },
  },

  methods: {
    focusFirst(id) {
      if (this.isGamepad) {
        id = this.currentView;
      } else {
        this.focused = false;
        log("Focus first reset");
        return false;
      }

      if (this.lastFocused[id] && id == "menu") {
        this.focused = `${id}.${this.lastFocused[id]}`;
        return true;
      }

      const idRefs = this.refs[id];

      if (!idRefs) {
        return false;
      }

      const firstRef = idRefs[0];

      log(`Focus first ref: ${id}.${firstRef}`);

      this.focused = `${id}.${firstRef}`;

      return true;
    },

    resetFlags() {
      for (const id in this.flags) {
        this.flags[id] = false;
      }
    },

    openStartMenu() {
      this.resetFlags();
      this.flags.menu = true;
      this.focusFirst("menu");

      log("Open start menu call", this.isShow);
    },

    openMenu() {
      this.resetFlags();
      this.flags.new = true;
      this.focusFirst("new");

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
      this.focusFirst("new");

      log("New game call", this.isShow);
    },

    newGameCallForce() {
      this.isStarted = false;
      this.newGameCall();
    },

    settingsCall() {
      this.resetFlags();
      this.flags.settings = true;
      this.focusFirst("settings");

      log("Settings call", this.isShow);
    },

    achievementsCall() {
      this.resetFlags();
      this.flags.achievements = true;
      this.focusFirst("achievements");

      log("Achievements call", this.isShow);
    },

    controlsCall() {
      this.resetFlags();
      this.flags.controls = true;
      this.focusFirst("controls");

      log("Controls call", this.isShow);
    },

    creditsCall() {
      this.resetFlags();
      this.flags.credits = true;
      this.focusFirst("credits");

      log("Credits call", this.isShow);
    },

    endCall() {
      this.resetFlags();
      this.flags.end = true;
      this.focusFirst("end");

      this.isStarted = false;

      log("End call", this.isShow);
    },

    continueCall() {
      this.resetFlags();
      this.flags.continue = true;
      this.focusFirst("continue");

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
      this.focusFirst("menu");

      if (this.isStarted) {
        this.$emit("back-to-game");
      }

      log("Back call", this.isShow);
    },

    backToMenu() {
      this.openStartMenu();

      this.isStarted = false;
      this.flags.end = false;
      this.focusFirst("menu");

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
      this.$store.commit("updateSettingsSpeed", -this.speedStep * 5);
    },

    nextSpeed() {
      this.$store.commit("updateSettingsSpeed", this.speedStep * 5);
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
      this.$store.commit("disableDev");
    },

    enableDevMode() {
      this.$store.commit("enableDev");
    },

    disableVibration() {
      this.$store.commit("disableVibration");
    },

    enableVibration() {
      this.$store.commit("enableVibration");

      this.emitter.emit("vibrate");
    },

    disableControls() {
      this.$store.commit("disableControls");
    },

    enableControls() {
      this.$store.commit("enableControls");
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

    async shareCall() {
      log("Share call");

      const { score } = this;

      try {
        await navigator.share({
          url: window.location.href,
          title: "Brains Out - The Game",
          text: `My score - ${score}! Can you play better?`,
        });
      } catch (error) {
        log(error);
      }
    },

    downHandler() {
      if (!this.focused) {
        return false;
      }

      const [flag, id] = this.focused.split(".");

      const refs = this.refs[flag];
      const length = refs.length;

      const index = refs.indexOf(id);

      let newIndex = index + 1;

      if (newIndex >= length) {
        newIndex = length - 1;
      }

      this.focused = `${flag}.${refs[newIndex]}`;

      return true;
    },

    upHandler() {
      if (!this.focused) {
        return false;
      }

      const [flag, id] = this.focused.split(".");

      const refs = this.refs[flag];

      const index = refs.indexOf(id);

      let newIndex = index - 1;

      if (newIndex <= 0) {
        newIndex = 0;
      }

      this.focused = `${flag}.${refs[newIndex]}`;

      return true;
    },

    leftHandler() {
      if (!this.focused) {
        return false;
      }

      const leftElement = this.$refs[`${this.focused}.prev`];

      if (leftElement) {
        leftElement.click();
      }

      return true;
    },

    rightHandler() {
      if (!this.focused) {
        return false;
      }

      const leftElement = this.$refs[`${this.focused}.next`];

      if (leftElement) {
        leftElement.click();
      }

      return true;
    },

    aHandler() {
      if (!this.focused) {
        return false;
      }

      log(`A press on: ${this.focused}`);

      if (this.$refs[this.focused]) {
        this.$refs[this.focused].click();
      }

      return true;
    },

    bHandler() {
      if (!this.focused) {
        return false;
      }

      log(`B press on: ${this.focused}`);

      const [flag] = this.focused.split(".");

      const refs = this.refs[flag];

      if (refs.includes("back")) {
        this.$refs[`${flag}.back`].click();
      }

      return true;
    },
  },

  watch: {
    isShow(newValue) {
      if (newValue) {
        this.emitter.emit("openMenuScreen");
      } else {
        this.emitter.emit("closeMenuScreen");
      }
    },

    focused(newValue) {
      if (!newValue) {
        return false;
      }

      log(`New focused: ${newValue}`);

      const [flag, id] = newValue.split(".");

      this.lastFocused[flag] = id;
    },
  },

  mounted() {
    this.emitter.on("openMenu", this.continueCall);
    this.emitter.on("openEndMenu", this.endCall);
    this.emitter.on("openStartMenu", this.openStartMenu);

    this.emitter.on("pressDown", this.downHandler);
    this.emitter.on("pressUp", this.upHandler);
    this.emitter.on("pressLeft", this.leftHandler);
    this.emitter.on("pressRight", this.rightHandler);
    this.emitter.on("pressA", this.aHandler);
    this.emitter.on("pressB", this.bHandler);

    this.emitter.on("enableGamepad", this.focusFirst);
    this.emitter.on("disableGamepad", this.focusFirst);

    window.addEventListener("blur", this.blurEvent);
  },

  beforeUnmount() {
    this.emitter.off("openMenu", this.continueCall);
    this.emitter.off("openEndMenu", this.endCall);
    this.emitter.off("openStartMenu", this.openStartMenu);

    window.removeEventListener("blur", this.blurEvent);

    this.emitter.off("pressDown", this.downHandler);
    this.emitter.off("pressUp", this.upHandler);
    this.emitter.off("pressLeft", this.leftHandler);
    this.emitter.off("pressRight", this.rightHandler);
    this.emitter.off("pressA", this.aHandler);
    this.emitter.off("pressB", this.bHandler);

    this.emitter.off("enableGamepad", this.focusFirst);
    this.emitter.off("disableGamepad", this.focusFirst);
  },
};
