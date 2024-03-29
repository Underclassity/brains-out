import { mapGetters } from "vuex";

// import levels from "../../assets/img/levels.svg";
// import pit from "../../assets/img/pit.svg";
import controller from "../../assets/img/controller.svg";
import keyboard from "../../assets/img/keyboard.svg";
// import levelsPit from "../../assets/img/levels-pit.svg";

import wImage from "../../assets/img/w.svg";
import sImage from "../../assets/img/s.svg";
import aImage from "../../assets/img/a.svg";
import dImage from "../../assets/img/d.svg";
import qImage from "../../assets/img/q.svg";
import eImage from "../../assets/img/e.svg";

import upImage from "../../assets/img/up.svg";
import downImage from "../../assets/img/down.svg";
import leftImage from "../../assets/img/left.svg";
import rightImage from "../../assets/img/right.svg";
import spaceImage from "../../assets/img/space.svg";
import escImage from "../../assets/img/esc.svg";

import rightStickImage from "../../assets/img/right-stick.svg";
import lbImage from "../../assets/img/lb.svg";
import rbImage from "../../assets/img/rb.svg";
import leftStickImage from "../../assets/img/left-stick.svg";
import dpadImage from "../../assets/img/dpad.svg";
import rtImage from "../../assets/img/rt.svg";
import aButtonImage from "../../assets/img/a-button.svg";
import menuButtonImage from "../../assets/img/menu-button.svg";

import log from "../../helpers/log.js";

export default {
  name: "ControlsInfoScreen",

  props: {
    show: {
      type: Boolean,
      default: false,
    },

    playButton: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      // levels,
      // pit,
      controller,
      keyboard,
      // levelsPit,

      showCount: 0,
    };
  },

  computed: {
    ...mapGetters(["colorPalette"]),

    colors() {
      return this.colorPalette.map((item) => `#${item.getHexString()}`);
    },

    keyboardKeys() {
      return [
        {
          id: "w",
          img: wImage,
          title: this.$t("rotateForward"),
        },
        {
          id: "s",
          img: sImage,
          title: this.$t("rotateBackward"),
        },
        {
          id: "a",
          img: aImage,
          title: this.$t("rotateLeft"),
        },
        {
          id: "d",
          img: dImage,
          title: this.$t("rotateRight"),
        },
        {
          id: "q",
          img: qImage,
          title: this.$t("rotateCounterclockwise"),
        },
        {
          id: "e",
          img: eImage,
          title: this.$t("rotateClockwise"),
        },

        {
          id: "up",
          img: upImage,
          title: this.$t("moveUp"),
        },
        {
          id: "down",
          img: downImage,
          title: this.$t("moveDown"),
        },
        {
          id: "left",
          img: leftImage,
          title: this.$t("moveLeft"),
        },
        {
          id: "right",
          img: rightImage,
          title: this.$t("moveRight"),
        },

        {
          id: "space",
          img: spaceImage,
          title: this.$t("dropFigure"),
        },
        {
          id: "esc",
          img: escImage,
          title: this.$t("pauseOpen"),
        },
      ];
    },

    controllerKeys() {
      return [
        {
          id: "right-stick",
          img: rightStickImage,
          title: this.$t("rotate"),
        },
        {
          id: "lb",
          img: lbImage,
          title: this.$t("rotateCounterclockwise"),
        },
        {
          id: "rb",
          img: rbImage,
          title: this.$t("rotateClockwise"),
        },
        {
          id: "movement",
          img: [leftStickImage, dpadImage],
          title: this.$t("move"),
        },
        {
          id: "drop",
          img: [rtImage, aButtonImage],
          title: this.$t("dropFigure"),
        },
        {
          id: "menu",
          img: menuButtonImage,
          title: this.$t("pauseOpen"),
        },
      ];
    },
  },

  methods: {
    /**
     * Log all helper
     *
     * @return  {Function}  Log function for component
     */
    log() {
      return log(`[${this.$options.name}]:`, ...arguments);
    },

    backClick() {
      this.log("Back click: ", this.playButton);
      this.$emit("back");
    },

    playClick() {
      this.log("Play click: ", this.playButton);
      this.$emit("play");
    },

    handleStick(event) {
      if (!this.show) {
        return false;
      }

      const container = this.$refs["container"];

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
    show(newValue) {
      if (newValue) {
        this.emitter.on("pressA", this.backClick);
        this.emitter.on("pressB", this.backClick);

        this.emitter.emit("showHowTo");

        this.showCount++;

        if (this.showCount >= 2) {
          this.emitter.emit("addAchievement", "how-to-play");
        }

        return true;
      }

      this.emitter.off("pressA", this.backClick);
      this.emitter.off("pressB", this.backClick);

      this.emitter.emit("hideHowTo");
    },
  },

  mounted() {
    const { back } = this.$refs;

    if (back) {
      back.focus();
    }

    this.emitter.on("stickEvent", this.handleStick);
  },
};
