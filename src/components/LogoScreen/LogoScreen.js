import logoSrc from "../../assets/img/green-logo.png";

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
