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
      this.$emit("update-smooth", this.isSmooth);
    },

    newGameCall() {
      this.$emit("new-game");
    },
  },
};
