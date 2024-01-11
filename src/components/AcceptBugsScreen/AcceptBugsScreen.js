import { mapState } from "vuex";
import { nextTick } from "vue";

import log from "../../helpers/log.js";

export default {
  name: "AcceptBugsScreen",

  data() {
    return {
      save: false,

      focused: "",

      refs: {
        screen: ["language", "back"],
      },
    };
  },

  computed: {
    ...mapState(["locale", "isGamepad"]),
  },

  methods: {
    log() {
      return log(`[${this.$options.name}]:`, ...arguments);
    },

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

    changeLanguage() {
      const newLocale = this.locale == "ru" ? "en" : "ru";

      this.log(`Change locale to: ${newLocale}`);

      this.$store.commit("changeLocale", newLocale);
      this.emitter.emit("changeLocale", newLocale);
    },

    downHandler() {
      if (!this.focused) {
        return false;
      }

      const [flag, id] = this.focused.split(".");

      const refs = this.refs[flag];
      const length = refs.length;

      const index = refs.indexOf(id);

      let newIndex = index + 1;

      if (newIndex >= length) {
        newIndex = length - 1;
      }

      this.focused = `${flag}.${refs[newIndex]}`;

      return true;
    },

    upHandler() {
      if (!this.focused) {
        return false;
      }

      const [flag, id] = this.focused.split(".");

      const refs = this.refs[flag];

      const index = refs.indexOf(id);

      let newIndex = index - 1;

      if (newIndex <= 0) {
        newIndex = 0;
      }

      this.focused = `${flag}.${refs[newIndex]}`;

      return true;
    },

    leftHandler() {
      if (!this.focused) {
        return false;
      }

      const leftElement = this.$refs[`${this.focused}.prev`];

      if (leftElement) {
        leftElement.click();
      }

      return true;
    },

    rightHandler() {
      if (!this.focused) {
        return false;
      }

      const leftElement = this.$refs[`${this.focused}.next`];

      if (leftElement) {
        leftElement.click();
      }

      return true;
    },

    aHandler() {
      if (this.focused == "screen.back") {
        this.yesClick();
      }
    },

    focusFirst() {
      if (!this.isGamepad) {
        this.focused = false;
        this.log("Focus first reset");
        return false;
      }

      this.focused = "screen.language";

      return true;
    },

    handleStick(event) {
      const container = this.$refs["scroll"];

      if (!container) {
        return false;
      }

      const { directionOfMovement } = event;

      const scrollValue = window.innerHeight / 5;

      switch (directionOfMovement) {
        case "top":
          container.scrollBy(0, -scrollValue);
          break;
        case "bottom":
          container.scrollBy(0, scrollValue);
          break;
      }

      return true;
    },
  },

  watch: {
    save(newValue) {
      this.$store.commit("updateAccepted", newValue);
    },

    focused(newValue) {
      if (!newValue) {
        return false;
      }

      this.log(`New focused: ${newValue}`);
    },
  },

  mounted() {
    this.emitter.on("enableGamepad", this.focusFirst);
    this.emitter.on("disableGamepad", this.focusFirst);

    this.emitter.on("pressDown", this.downHandler);
    this.emitter.on("pressUp", this.upHandler);
    this.emitter.on("pressLeft", this.leftHandler);
    this.emitter.on("pressRight", this.rightHandler);

    this.emitter.on("stickEvent", this.handleStick);

    this.emitter.on("pressA", this.aHandler);
  },

  beforeUnmount() {
    this.emitter.off("enableGamepad", this.focusFirst);
    this.emitter.off("disableGamepad", this.focusFirst);

    this.emitter.off("pressDown", this.downHandler);
    this.emitter.off("pressUp", this.upHandler);
    this.emitter.off("pressLeft", this.leftHandler);
    this.emitter.off("pressRight", this.rightHandler);

    this.emitter.off("stickEvent", this.handleStick);

    this.emitter.off("pressA", this.aHandler);
  },
};
