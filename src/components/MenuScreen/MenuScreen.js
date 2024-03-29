import { nextTick } from "vue";
import { mapState, mapGetters } from "vuex";

import assets from "../../store/assets.js";

import log from "../../helpers/log.js";

import halloweenLogo from "../../assets/img/halloween-logo.png";
import logoSrc from "../../assets/img/green-logo.png";
import simpleLogo from "../../assets/img/simple-logo.png";

import achievements from "../../i18n/achievements.js";

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
      halloweenLogo,
      logoSrc,
      simpleLogo,

      flags: {
        menu: false,
        mode: false,
        new: false,
        settings: false,
        howTo: false,
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

      isShare:
        "share" in navigator &&
        navigator?.canShare({ url: "", text: "", title: "" }),

      assets,

      resolution: 100,

      refs: {
        menu: [
          "newGame",
          "practice",
          "settings",
          // "controls",
          "howTo",
          "achievements",
          "credits",
        ],
        new: [
          "pitWidth",
          "pitHeight",
          "pitDepth",
          "blocksType",
          "speed",
          "endless",
          "back",
          "play",
        ],
        mode: ["modes", "back", "next"],
        credits: ["back"],
        // controls: ["back"],
        settings: [
          "pixelRatio",
          "fpsLock",
          "antialias",
          "grid",
          "color",
          "theme",
          "volume",
          "fxVolume",
          "language",
          "dev",
          "vibration",
          "controls",
          "back",
        ],
        end: ["new", "startAgain", "back", "share"],
        continue: ["new", "startAgain", "continue", "howTo", "back"],
        achievements: ["back"],
      },

      lastFocused: {},

      focused: false,

      isDevApproved: !import.meta.env?.VITE_IS_DEV_MODE,
    };
  },

  computed: {
    ...mapState([
      "locale",

      "volume",
      "fxVolume",

      "score",

      "pitSize",
      "pitSizes",
      "pitWidth",
      "pitHeight",
      "pitDepth",

      "colorPaletteType",
      "colorPaletteTypes",

      "blocksTypeOptions",
      "blocksType",

      "settingsSpeed",
      "speedStep",
      "minSpeed",
      "maxSpeed",

      "isEndless",
      "isPractice",

      "colorlessMode",
      "colorlessModes",

      "theme",
      "themes",

      "isFpsLock",
      "fpsLockValue",

      "randomFiguresCount",

      "maxRotate",

      "pixelRatio",
      "antialias",

      "version",
      "appVersion",

      "isDev",
      "isControls",
      "isVibration",
      "isPitGrid",

      "isGamepad",

      "achievements",
      "userAchievements",

      "timelessMaxTime",

      "mode",
      "modes",
    ]),

    ...mapGetters(["maxScore"]),

    imgSrc() {
      const { theme, halloweenLogo, simpleLogo, logoSrc } = this;

      if (theme == "halloween") {
        return halloweenLogo;
      }

      if (theme == "simple") {
        return simpleLogo;
      }

      return logoSrc;
    },

    devicePixelRatio() {
      return Math.round(window.devicePixelRatio);
    },

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

    scale() {
      const { devicePixelRatio, pixelRatio } = this;

      return Math.round((pixelRatio / devicePixelRatio) * 100);
    },

    graphicsMode() {
      const { pixelRatio } = this;

      return pixelRatio > 3
        ? this.$t("ultra")
        : pixelRatio > 2 && pixelRatio <= 3
        ? this.$t("high")
        : pixelRatio > 1 && pixelRatio <= 2
        ? this.$t("mid")
        : this.$t("low");
    },
  },

  methods: {
    log() {
      return log(`[${this.$options.name}]:`, ...arguments);
    },

    focusFirst(id) {
      if (this.isGamepad) {
        id = this.currentView;
        this.log("Set focus first to: ", id);
      } else {
        this.focused = false;
        this.log("Focus first reset");
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

      this.log(`Focus first ref: ${id}.${firstRef}`);

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

      this.log("Open start menu call", this.isShow);
    },

    openMenu() {
      this.resetFlags();
      this.flags.new = true;
      this.focusFirst("new");

      this.log("Open menu call", this.isShow);
    },

    closeMenu() {
      this.resetFlags();

      this.$emit("back-to-game");

      this.log("Close menu call", this.isShow);
    },

    newGameCall() {
      this.resetFlags();
      this.flags.mode = true;
      this.focusFirst("modes");

      this.log("New game call", this.isShow);
    },

    nextClick() {
      this.resetFlags();
      this.flags.new = true;
      this.focusFirst("new");

      this.log("Next click call", this.isShow);
    },

    newGameCallForce() {
      this.isStarted = false;
      this.newGameCall();
    },

    settingsCall() {
      this.resetFlags();
      this.flags.settings = true;
      this.focusFirst("settings");

      this.log("Settings call", this.isShow);
    },

    achievementsCall() {
      this.resetFlags();
      this.flags.achievements = true;
      this.focusFirst("achievements");

      this.log("Achievements call", this.isShow);
    },

    controlsCall() {
      this.resetFlags();
      this.flags.controls = true;
      this.focusFirst("controls");

      this.log("Controls call", this.isShow);
    },

    creditsCall() {
      this.resetFlags();
      this.flags.credits = true;
      this.focusFirst("credits");

      this.log("Credits call", this.isShow);
    },

    endCall() {
      this.resetFlags();
      this.flags.end = true;
      this.focusFirst("end");

      this.isStarted = false;

      this.log("End call", this.isShow);
    },

    continueCall() {
      this.resetFlags();
      this.flags.continue = true;
      this.focusFirst("continue");

      this.log("Continue call", this.isShow);
    },

    startAgainCall() {
      if (!this.isStarted) {
        this.isStarted = true;
      }

      this.resetFlags();

      this.$store.commit("updatePractice", true);
      this.$store.commit("setMode", "original");

      this.$emit("new-game");

      this.log("Start again call", this.isShow);
    },

    howToPlay() {
      this.log("How to play call");

      this.emitter.emit("how-to-play", true);
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

      this.log("Back call", this.isShow);
    },

    backToModes() {
      this.resetFlags();
      this.flags.mode = true;
      this.focusFirst("mode");

      this.log("Back to modes call", this.isShow);
    },

    backToMenu() {
      this.openStartMenu();

      this.isStarted = false;
      this.flags.end = false;
      this.focusFirst("menu");

      this.log("Back to menu call", this.isShow);
    },

    playClick() {
      this.resetFlags();

      if (!this.isStarted) {
        this.isStarted = true;
      }

      this.$store.commit("updatePractice", false);
      this.$emit("new-game");

      this.log("Play click call", this.isShow);
    },

    practiceClick() {
      this.resetFlags();

      if (!this.isStarted) {
        this.isStarted = true;
      }

      this.$store.commit("updatePractice", true);
      this.$emit("new-game");

      this.$store.commit("setMode", "original");

      this.log("Play click call", this.isShow);
    },

    enableEndless() {
      this.$store.commit("enableEndless");
    },

    disableEndless() {
      this.$store.commit("disableEndless");
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

    prevPixelRatio() {
      this.$store.commit("updatePixelRatio", -1);
    },

    nextPixelRatio() {
      this.$store.commit("updatePixelRatio", +1);
    },

    setPixelRatio(value = 1) {
      this.$store.commit("setPixelRatio", value);
    },

    setFpsLock(value) {
      if (value) {
        this.$store.commit("setFpsLockValue", value);
        this.$store.commit("setFpsLock", true);
      } else {
        this.$store.commit("setFpsLock", false);
      }
    },

    nextColorPalette() {
      let newIndex = this.colorPaletteTypes.indexOf(this.colorPaletteType) + 1;

      if (newIndex >= this.colorPaletteTypes.length - 1) {
        newIndex = this.colorPaletteTypes.length - 1;
      }

      this.$store.commit("setColorPalette", this.colorPaletteTypes[newIndex]);
    },

    prevColorPalette() {
      let newIndex = this.colorPaletteTypes.indexOf(this.colorPaletteType) - 1;

      if (newIndex <= 0) {
        newIndex = 0;
      }

      this.$store.commit("setColorPalette", this.colorPaletteTypes[newIndex]);
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

    disablePitGrid() {
      this.$store.commit("disablePitGrid");
    },

    enablePitGrid() {
      this.$store.commit("enablePitGrid");
    },

    disableAntialias() {
      this.$store.commit("disableAntialias");
    },

    enableAntialias() {
      this.$store.commit("enableAntialias");
    },

    prevTheme() {
      this.$store.commit(
        "setTheme",
        this.themes[this.themes.indexOf(this.theme) - 1]
      );
    },

    nextTheme() {
      this.$store.commit(
        "setTheme",
        this.themes[this.themes.indexOf(this.theme) + 1]
      );
    },

    changeRandomFigures() {
      this.$store.commit(
        "setRandomFiguresCount",
        this.randomFiguresCount == 5 ? 10 : 5
      );
    },

    prevColorlessMode() {
      let index = this.colorlessModes.indexOf(this.colorlessMode);

      index--;

      if (index < 0) {
        index = this.colorlessModes.length - 1;
      }

      this.$store.commit("setColorlessMode", this.colorlessModes[index]);
    },

    nextColorlessMode() {
      let index = this.colorlessModes.indexOf(this.colorlessMode);

      index++;

      if (index > this.colorlessModes.length - 1) {
        index = 0;
      }

      this.$store.commit("setColorlessMode", this.colorlessModes[index]);
    },

    prevLanguage() {
      this.$store.commit("changeLocale", "ru");
      this.emitter.emit("changeLocale", "ru");
    },

    nextLanguage() {
      this.$store.commit("changeLocale", "en");
      this.emitter.emit("changeLocale", "en");
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
      this.log("Share call");

      const { score } = this;

      try {
        await navigator.share({
          url: window.location.href,
          title: "Brains Out - The Game",
          text: `My score - ${score}! Can you play better?`,
        });
      } catch (error) {
        this.log(error);
      }
    },

    downHandler() {
      if (!this.focused) {
        return false;
      }

      if (this.flags.howTo) {
        return false;
      }

      const [flag, id] = this.focused.split(".");

      const refs = this.refs[flag];
      const length = refs.length;

      const index = refs.indexOf(id);

      let newIndex = index + 1;

      if (!this.isPractice && refs[newIndex] == "startAgain") {
        newIndex++;
      }

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

      if (this.flags.howTo) {
        return false;
      }

      const [flag, id] = this.focused.split(".");

      const refs = this.refs[flag];

      const index = refs.indexOf(id);

      let newIndex = index - 1;

      if (!this.isPractice && refs[newIndex] == "startAgain") {
        newIndex--;
      }

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

      if (this.flags.howTo) {
        return false;
      }

      const leftElement = this.$refs[`${this.focused}.prev`];

      if (leftElement) {
        leftElement.click();
      }

      if (this.focused == "settings.pixelRatio") {
        this.resolution -= 100;

        if (this.resolution <= 100) {
          this.resolution = 100;
        }
      }

      return true;
    },

    rightHandler() {
      if (!this.focused) {
        return false;
      }

      if (this.flags.howTo) {
        return false;
      }

      const leftElement = this.$refs[`${this.focused}.next`];

      if (leftElement) {
        leftElement.click();
      }

      if (this.focused == "settings.pixelRatio") {
        this.resolution += 100;

        if (this.resolution >= 400) {
          this.resolution = 400;
        }
      }

      return true;
    },

    aHandler() {
      if (!this.focused) {
        return false;
      }

      this.log(`A press on: ${this.focused}`);

      if (this.$refs[this.focused]) {
        this.$refs[this.focused].click();
      }

      return true;
    },

    bHandler() {
      if (!this.focused) {
        return false;
      }

      this.log(`B press on: ${this.focused}`);

      const [flag] = this.focused.split(".");

      const refs = this.refs[flag];

      if (refs.includes("continue")) {
        this.$refs[`${flag}.continue`].click();
      } else if (refs.includes("back")) {
        this.$refs[`${flag}.back`].click();
      }

      return true;
    },

    checkSharePermissions() {
      this.isShare = navigator.canShare?.({ url: "", text: "", title: "" });

      return this.isShare;
    },

    async isOverflow(refId) {
      if (!refId) {
        return false;
      }

      const element = this.$refs[refId];

      if (!element) {
        return false;
      }

      // Wait for ref load
      await nextTick();

      return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      );
    },

    showHowTo() {
      this.flags.howTo = true;
    },

    hideHowTo() {
      this.flags.howTo = false;
    },

    prevMode() {
      this.$store.commit("prevMode");
    },

    nextMode() {
      this.$store.commit("nextMode");
    },

    prevTimeTimeless() {
      const values = [2 * 60 * 1000, 60 * 1000, 30 * 1000, 10 * 1000];
      let index = values.indexOf(this.timelessMaxTime);

      index--;

      if (index < 0) {
        index = values.length - 1;
      }

      this.$store.commit("setTimelessMaxTime", values[index]);
    },

    nextTimeTimeless() {
      const values = [2 * 60 * 1000, 60 * 1000, 30 * 1000, 10 * 1000];
      let index = values.indexOf(this.timelessMaxTime);

      index++;

      if (index > values.length - 1) {
        index = 0;
      }

      this.$store.commit("setTimelessMaxTime", values[index]);
    },

    prevRotates() {
      const newMaxRotate = this.maxRotate == 5 ? 3 : 5;
      this.$store.commit("setMaxRotate", newMaxRotate);
    },

    nextRotates() {
      const newMaxRotate = this.maxRotate == 5 ? 3 : 5;
      this.$store.commit("setMaxRotate", newMaxRotate);
    },

    upPitWidth() {
      this.$store.commit(
        "updatePitSize",
        `${this.pitWidth + 1}x${this.pitHeight}x${this.pitDepth}`
      );
    },

    downPitWidth() {
      this.$store.commit(
        "updatePitSize",
        `${this.pitWidth - 1}x${this.pitHeight}x${this.pitDepth}`
      );
    },

    upPitHeight() {
      this.$store.commit(
        "updatePitSize",
        `${this.pitWidth}x${this.pitHeight + 1}x${this.pitDepth}`
      );
    },

    downPitHeight() {
      this.$store.commit(
        "updatePitSize",
        `${this.pitWidth}x${this.pitHeight - 1}x${this.pitDepth}`
      );
    },

    upPitDepth() {
      this.$store.commit(
        "updatePitSize",
        `${this.pitWidth}x${this.pitHeight}x12`
      );
    },

    downPitDepth() {
      this.$store.commit(
        "updatePitSize",
        `${this.pitWidth}x${this.pitHeight}x8`
      );
    },

    getAchiementItem(id) {
      return achievements[this.$i18n.locale][id];
    },

    achievementClick(name) {
      if (name == "click-me") {
        this.emitter.emit("addAchievement", "click-me");
      }
    },

    handleStick(event) {
      let container;

      if (this.flags.settings) {
        container = this.$refs["settings.scroll"];
      }

      if (this.flags.new) {
        container = this.$refs["new.scroll"];
      }

      if (this.flags.achievements) {
        container = this.$refs["achievements.scroll"];
      }

      if (!container) {
        return false;
      }

      const { directionOfMovement } = event;

      const scrollValue = window.innerHeight / 5;

      switch (directionOfMovement) {
        case "top":
          container.scrollBy(0, -scrollValue);
          break;
        case "bottom":
          container.scrollBy(0, scrollValue);
          break;
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

    async focused(newValue) {
      if (!newValue) {
        return false;
      }

      this.log(`New focused: ${newValue}`);

      const [flag, id] = newValue.split(".");

      this.lastFocused[flag] = id;

      await nextTick();

      if (!this.$refs[newValue]) {
        return false;
      }

      this.$refs[newValue].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    },

    resolution(newValue) {
      const resolution = parseInt(newValue, 10);

      const newPixelRatio = (resolution / 100) * this.devicePixelRatio;

      this.$store.commit("setPixelRatio", newPixelRatio);
    },

    mode(modeType) {
      switch (modeType) {
        case "original":
          this.refs.mode = ["modes", "back", "next"];
          break;
        case "time attack":
          this.refs.mode = ["modes", "time", "back", "next"];
          break;
        case "rotating pit":
          this.refs.mode = ["modes", "back", "next"];
          break;
        case "limited rotations":
          this.refs.mode = ["modes", "rotates", "back", "next"];
          break;
        case "random rotations":
          this.refs.mode = ["modes", "back", "next"];
          break;
        case "glitch mayhem":
          this.refs.mode = ["modes", "back", "next"];
          break;
        case "pit mess":
          this.refs.mode = ["modes", "mess", "back", "next"];
          break;
        case "color madness":
          this.refs.mode = ["modes", "colorless", "back", "next"];
          break;
        default:
          this.refs.mode = ["modes", "back", "next"];
          break;
      }

      this.focusFirst("modes");
    },
  },

  mounted() {
    this.emitter.on("openMenu", this.continueCall);
    this.emitter.on("closeMenu", this.closeMenu);
    this.emitter.on("openEndMenu", this.endCall);
    this.emitter.on("openStartMenu", this.openStartMenu);

    this.emitter.on("pressDown", this.downHandler);
    this.emitter.on("pressUp", this.upHandler);
    this.emitter.on("pressLeft", this.leftHandler);
    this.emitter.on("pressRight", this.rightHandler);
    this.emitter.on("pressA", this.aHandler);
    this.emitter.on("pressB", this.bHandler);

    this.emitter.on("stickEvent", this.handleStick);

    this.emitter.on("showHowTo", this.showHowTo);
    this.emitter.on("hideHowTo", this.hideHowTo);

    this.emitter.on("enableGamepad", this.focusFirst);
    this.emitter.on("disableGamepad", this.focusFirst);

    window.addEventListener("blur", this.blurEvent);

    this.checkSharePermissions();

    // Update resolution for init
    this.resolution = this.scale;
  },

  beforeUnmount() {
    this.emitter.off("openMenu", this.continueCall);
    this.emitter.off("closeMenu", this.closeMenu);
    this.emitter.off("openEndMenu", this.endCall);
    this.emitter.off("openStartMenu", this.openStartMenu);

    window.removeEventListener("blur", this.blurEvent);

    this.emitter.off("pressDown", this.downHandler);
    this.emitter.off("pressUp", this.upHandler);
    this.emitter.off("pressLeft", this.leftHandler);
    this.emitter.off("pressRight", this.rightHandler);
    this.emitter.off("pressA", this.aHandler);
    this.emitter.off("pressB", this.bHandler);

    this.emitter.off("stickEvent", this.handleStick);

    this.emitter.off("showHowTo", this.showHowTo);
    this.emitter.off("hideHowTo", this.hideHowTo);

    this.emitter.off("enableGamepad", this.focusFirst);
    this.emitter.off("disableGamepad", this.focusFirst);
  },
};
