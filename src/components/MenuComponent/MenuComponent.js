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
  },

  data() {
    return {
      currentPitSize: this.pitSize,
      currentSpeed: this.speed,
      isSmooth: this.smooth,
      instanced: this.isInstanced,
      controls: this.isControls,
      simple: this.isSimple,

      volume: 0.5,

      sound: "ZombiesAreComing.ogg",

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
        "Iwan Gabovitch - Dark Ambience Loop.flac",
        "Iwan Gabovitch - Dark Ambience Loop.mp3",
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
  },
};
