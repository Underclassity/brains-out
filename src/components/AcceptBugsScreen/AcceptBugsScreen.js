export default {
  name: "AcceptBugsScreen",

  methods: {
    yesClick() {
      this.$emit("accept");
    },
  },

  mounted() {
    const { button } = this.$refs;

    if (button) {
      button.focus();
    }

    this.emitter.on("pressA", this.yesClick);
  },

  beforeUnmount() {
    this.emitter.off("pressA", this.yesClick);
  },
};
