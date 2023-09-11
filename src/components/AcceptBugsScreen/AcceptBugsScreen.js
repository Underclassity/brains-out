export default {
  name: "AcceptBugsScreen",

  methods: {
    yesClick() {
      this.$emit("accept");
    },
  },
};
