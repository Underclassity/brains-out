export default {
  name: "MenuComponent",

  props: {
    isMenu: {
      type: Boolean,
      default: false,
    },

    isEnd: {
      type: Boolean,
      default: false,
    },

    isSimple: {
      type: Boolean,
      default: false,
    },

    isControls: {
      type: Boolean,
      default: true,
    },

    isInstanced: {
      type: Boolean,
      default: false,
    },

    pitSize: {
      type: String,
      default: "5x5x12",
    },

    speed: {
      type: Number,
      default: 0.5,
    },

    minSpeed: {
      type: Number,
      default: 0.5,
    },

    maxSpeed: {
      type: Number,
      default: 10,
    },

    speedStep: {
      type: Number,
      default: 0.2,
    },

    smooth: {
      type: Boolean,
      default: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    inputSound: {
      type: String,
      default: "ZombiesAreComing.ogg",
    },

    inputVolume: {
      type: Number,
      default: 0.5,
    },

    inputFxVolume: {
      type: Number,
      default: 0.8,
    },

    inputBlocksType: {
      type: String,
      default: "flat",
    },
  },

  data() {
    return {
      currentPitSize: this.pitSize,
      currentSpeed: this.speed,
      isSmooth: this.smooth,
      instanced: this.isInstanced,
      controls: this.isControls,
      simple: this.isSimple,
      volume: this.inputVolume,
      fxVolume: this.inputFxVolume,
      sound: this.inputSound,
      blocksType: this.inputBlocksType,

      // https://opengameart.org/
      audio: [
        "biohazardsextended.ogg",
        "biohazardsopening.ogg",
        "biohazardsv3.ogg",
        "Day_1_v2.ogg",
        "Day_1_v3.ogg",
        "Day_1.ogg",
        "Disco Is Undead.mp3",
        "fall.wav",
        "Iwan Gabovitch - Dark Ambience Loop.ogg",
        "last_fight.mp3",
        "Pripyat 2.0 Chiptune.mp3",
        "Recall of the Shadows (Casio synth string version).mp3",
        "Recall of the Shadows.mp3",
        "Zombie Attack Sound.wav",
        "zombie main music.ogg",
        "Zombie Sound.wav",
        "zombieHoouw_1.mp3",
        "zombieHoouw_2.mp3",
        "zombieHoouw_3.mp3",
        "ZombiesAreComing.ogg",
      ],

      blocksTypeOptions: ["flat", "basic", "extended"],
    };
  },

  methods: {
    closeMenu() {
      this.$emit("close-menu");
    },

    changePitSize() {
      this.$emit("change-pit-size", this.currentPitSize);
    },

    changeSpeed() {
      this.$emit("change-speed", this.currentSpeed);
    },

    updateSmooth() {
      this.$emit("update-smooth", this.controls);
    },

    updateInstanced() {
      this.$emit("update-instanced", this.instanced);
    },

    updateSimple() {
      this.$emit("update-simple", this.simple);
    },

    updateControls() {
      this.$emit("update-controls", this.controls);
    },

    newGameCall() {
      this.$emit("new-game");
    },

    updateVolume() {
      this.$emit("update-volume", this.volume);
    },

    updateFxVolume() {
      this.$emit("update-fx-volume", this.fxVolume);
    },

    updateSound() {
      this.$emit("update-sound", this.sound);
    },

    updateBlocksType() {
      this.$emit("update-blocks-type", this.blocksType);
    },
  },

  mounted() {
    this.$emit("update-fx-volume", this.fxVolume);
    this.$emit("update-sound", this.sound);
    this.$emit("update-volume", this.volume);
  },
};
