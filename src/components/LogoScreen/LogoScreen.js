import logoSrc from "../../assets/img/halloween-logo.png";

export default {
  name: "LogoScreen",

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      logoSrc,
    };
  },
};
