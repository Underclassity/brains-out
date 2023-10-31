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

      keyboardKeys: [
        {
          id: "w",
          img: wImage,
          title: "Rotate forward",
        },
        {
          id: "s",
          img: sImage,
          title: "Rotate backward",
        },
        {
          id: "a",
          img: aImage,
          title: "Rotate left",
        },
        {
          id: "d",
          img: dImage,
          title: "Rotate right",
        },
        {
          id: "q",
          img: qImage,
          title: "Rotate counterclockwise",
        },
        {
          id: "e",
          img: eImage,
          title: "Rotate clockwise",
        },

        {
          id: "up",
          img: upImage,
          title: "Move up",
        },
        {
          id: "down",
          img: downImage,
          title: "Move down",
        },
        {
          id: "left",
          img: leftImage,
          title: "Move left",
        },
        {
          id: "right",
          img: rightImage,
          title: "Move right",
        },

        {
          id: "space",
          img: spaceImage,
          title: "Drop figure",
        },
        {
          id: "esc",
          img: escImage,
          title: "Pause/Open menu",
        },
      ],

      controllerKeys: [
        {
          id: "right-stick",
          img: rightStickImage,
          title: "Rotate forward, backward, left or right",
        },
        {
          id: "lb",
          img: lbImage,
          title: "Rotate counterclockwise",
        },
        {
          id: "rb",
          img: rbImage,
          title: "Rotate clockwise",
        },
        {
          id: "movement",
          img: [leftStickImage, dpadImage],
          title: "Move up, down, left or right",
        },
        {
          id: "drop",
          img: [rtImage, aButtonImage],
          title: "Drop figure",
        },
        {
          id: "menu",
          img: menuButtonImage,
          title: "Pause/Open menu",
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["colorPalette"]),

    colors() {
      return this.colorPalette.map((item) => `#${item.getHexString()}`);
    },
  },

  methods: {
    backClick() {
      log("Back click");
      this.$emit("back");
    },
  },

  watch: {
    show(newValue) {
      if (newValue) {
        this.emitter.on("pressA", this.backClick);
        this.emitter.on("pressB", this.backClick);

        this.emitter.emit("showHowTo");
        return;
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
  },
};
