import log from "../../helpers/log.js";

import logoSrc from "../../assets/img/logo-cut.png";

export default {
  name: "MenuScreen",

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

      pitSize: "5x5x12",
      pitSizes: ["5x5x12", "10x10x12", "7x4x12"],

      minSpeed: 0.5,
      speed: 0.5,
      maxSpeed: 10,
      speedStep: 0.1,

      volume: 0.2,
      fxVolume: 0.6,

      isDev: false,
      isControls: false,

      blocksTypeOptions: ["flat", "basic", "extended"],
      blockType: "flat",

      version: import.meta.env.VITE_APP_VERSION,
    };
  },

  computed: {
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

      if (this.isStarted) {
        this.$emit("back-to-game");
      }

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
      this.pitSize = this.pitSizes[this.pitSizes.indexOf(this.pitSize) - 1];

      this.emitter.emit("changePitSize", this.pitSize);
    },

    nextPitSize() {
      this.pitSize = this.pitSizes[this.pitSizes.indexOf(this.pitSize) + 1];

      this.emitter.emit("changePitSize", this.pitSize);
    },

    prevBlockType() {
      this.blockType =
        this.blocksTypeOptions[
          this.blocksTypeOptions.indexOf(this.blockType) - 1
        ];

      this.emitter.emit("changeBlockType", this.blockType);
    },

    nextBlockType() {
      this.blockType =
        this.blocksTypeOptions[
          this.blocksTypeOptions.indexOf(this.blockType) + 1
        ];

      this.emitter.emit("changeBlockType", this.blockType);
    },

    prevSpeed() {
      this.speed -= this.speedStep;

      this.speed = Math.round(this.speed * 100) / 100;

      if (this.speed <= this.minSpeed) {
        this.speed = this.minSpeed;
      }

      this.emitter.emit("changeSpeed", this.speed);
    },

    nextSpeed() {
      this.speed += this.speedStep;

      this.speed = Math.round(this.speed * 100) / 100;

      if (this.speed >= this.maxSpeed) {
        this.speed = this.maxSpeed;
      }

      this.emitter.emit("changeSpeed", this.speed);
    },

    prevVolume() {
      this.volume -= 0.1;

      this.volume = Math.round(this.volume * 100) / 100;

      if (this.volume <= 0) {
        this.volume = 0;
      }

      this.emitter.emit("changeVolume", this.volume);
    },

    nextVolume() {
      this.volume += 0.1;

      this.volume = Math.round(this.volume * 100) / 100;

      if (this.volume >= 1) {
        this.volume = 1;
      }

      this.emitter.emit("changeVolume", this.volume);
    },

    prevFxVolume() {
      this.fxVolume -= 0.1;

      this.fxVolume = Math.round(this.fxVolume * 100) / 100;

      if (this.fxVolume <= 0) {
        this.fxVolume = 0;
      }

      this.emitter.emit("changeFxVolume", this.fxVolume);
    },

    nextFxVolume() {
      this.fxVolume += 0.1;

      this.fxVolume = Math.round(this.fxVolume * 100) / 100;

      if (this.fxVolume >= 1) {
        this.fxVolume = 1;
      }

      this.emitter.emit("changeFxVolume", this.fxVolume);
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
  },

  mounted() {
    // this.emitter.emit("changeBlockType", this.blockType);
    // this.emitter.emit("changePitSize", this.pitSize);
    // this.emitter.emit("changeSpeed", this.speed);
    // this.emitter.emit("changeVolume", this.volume);
    // this.emitter.emit("changeFxVolume", this.fxVolume);

    this.emitter.on("openMenu", this.continueCall);
    this.emitter.on("openEndMenu", this.endCall);
    this.emitter.on("openStartMenu", this.openStartMenu);
  },
};
