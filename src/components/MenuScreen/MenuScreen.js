import log from "../../helpers/log.js";

export default {
  name: "MenuScreen",

  data() {
    return {
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
      speedStep: 0.2,

      volume: 0.2,
      fxVolume: 0.6,

      isDev: false,

      blocksTypeOptions: ["flat", "basic", "extended"],
      blockType: "flat",
    };
  },

  computed: {
    isShow() {
      return (
        this.isMenu ||
        this.isNewGame ||
        this.isControls ||
        this.isSettings ||
        this.isCredits ||
        this.isEnd ||
        this.isContinue
      );
    },
  },

  methods: {
    openStartMenu() {
      this.isMenu = true;
      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = false;

      log("Open start menu call", this.isShow);
    },

    openMenu() {
      this.isMenu = false;
      this.isNewGame = true;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = false;

      log("Open menu call", this.isShow);
    },

    closeMenu() {
      this.isMenu = false;
      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = false;

      if (this.isStarted) {
        this.$emit("back-to-game");
      }

      log("Close menu call", this.isShow);
    },

    newGameCall() {
      this.isMenu = false;
      this.isNewGame = true;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = false;

      log("New game call", this.isShow);
    },

    newGameCallForce() {
      this.isStarted = false;
      this.newGameCall();
    },

    settingsCall() {
      this.isMenu = false;
      this.isNewGame = false;
      this.isSettings = true;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = false;

      log("Settings call", this.isShow);
    },

    controlsCall() {
      this.isMenu = false;
      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = true;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = false;

      log("Controls call", this.isShow);
    },

    creditsCall() {
      this.isMenu = false;
      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = true;
      this.isContinue = false;
      this.isEnd = false;

      log("Credits call", this.isShow);
    },

    endCall() {
      this.isMenu = false;
      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = true;

      log("End call", this.isShow);
    },

    continueCall() {
      this.isMenu = false;
      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = true;
      this.isEnd = false;

      log("Continue call", this.isShow);
    },

    startAgainCall() {
      if (!this.isStarted) {
        this.isStarted = true;
      }

      this.isMenu = false;
      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = false;

      this.$emit("new-game");

      log("Start again call", this.isShow);
    },

    back() {
      if (this.isEnd) {
        this.isStarted = false;
      }

      this.isMenu = this.isStarted ? false : true;

      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;
      this.isContinue = false;
      this.isEnd = false;

      if (this.isStarted) {
        this.$emit("back-to-game");
      }

      log("Back call", this.isShow);
    },

    backToMenu() {
      this.openStartMenu();

      this.isStarted = false;
      this.isEnd = false;

      log("Back to menu call", this.isShow);
    },

    playClick() {
      this.isMenu = false;
      this.isNewGame = false;
      this.isSettings = false;
      this.isControls = false;
      this.isCredits = false;

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

      this.speed = Math.floor(this.speed * 100) / 100;

      if (this.speed <= this.minSpeed) {
        this.speed = this.minSpeed;
      }

      this.emitter.emit("changeSpeed", this.speed);
    },

    nextSpeed() {
      this.speed += this.speedStep;

      this.speed = Math.floor(this.speed * 100) / 100;

      if (this.speed >= this.maxSpeed) {
        this.speed = this.maxSpeed;
      }

      this.emitter.emit("changeSpeed", this.speed);
    },

    prevVolume() {
      this.volume -= 0.1;

      this.volume = Math.floor(this.volume * 100) / 100;

      if (this.volume <= 0) {
        this.volume = 0;
      }

      this.emitter.emit("changeVolume", this.volume);
    },

    nextVolume() {
      this.volume += 0.1;

      this.volume = Math.floor(this.volume * 100) / 100;

      if (this.volume >= 1) {
        this.volume = 1;
      }

      this.emitter.emit("changeVolume", this.volume);
    },

    prevFxVolume() {
      this.fxVolume -= 0.1;

      this.fxVolume = Math.floor(this.fxVolume * 100) / 100;

      if (this.fxVolume <= 0) {
        this.fxVolume = 0;
      }

      this.emitter.emit("changeFxVolume", this.fxVolume);
    },

    nextFxVolume() {
      this.fxVolume += 0.1;

      this.fxVolume = Math.floor(this.fxVolume * 100) / 100;

      if (this.fxVolume >= 1) {
        this.fxVolume = 1;
      }

      this.emitter.emit("changeFxVolume", this.fxVolume);
    },

    disableDevMode() {
      this.isDev = true;

      this.emitter.emit("updateDevMode", this.isDev);
    },

    enableDevMode() {
      this.isDev = false;

      this.emitter.emit("updateDevMode", this.isDev);
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
