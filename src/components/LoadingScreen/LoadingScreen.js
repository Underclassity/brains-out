import { mapState } from "vuex";

export default {
  name: "LoadingScreen",

  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      intervalId: undefined,
      count: 0,
    };
  },

  computed: {
    ...mapState(["eta"]),
  },

  mounted() {
    this.intervalId = setInterval(() => {
      this.count += 1;

      if (this.count > 4) {
        this.count = 0;
      }
    }, 250);
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
