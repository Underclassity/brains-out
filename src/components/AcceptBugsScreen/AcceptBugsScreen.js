export default {
  name: "AcceptBugsScreen",

  data() {
    return {
      save: false,
    };
  },

  methods: {
    yesClick() {
      this.$emit("accept");
    },
  },

  watch: {
    save(newValue) {
      this.$store.commit("updateAccepted", newValue);
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
