export default {
  name: "MenuComponent",

  props: {
    isMenu: {
      type: Boolean,
      default: false,
    },

    pitSize: {
      type: String,
      default: "5x5x12",
    },
  },

  data() {
    return {
      currentPitSize: this.pitSize,
    };
  },

  methods: {
    closeMenu() {
      console.log("Close menu");
      this.$emit("close-menu");
    },

    changePitSize() {
      this.$emit("change-pit-size", this.currentPitSize);
    },
  },
};
