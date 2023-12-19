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
