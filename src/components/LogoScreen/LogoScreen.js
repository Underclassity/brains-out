import { mapState } from "vuex";

import logoSrc from "../../assets/img/green-logo.png";
import halloweenLogo from "../../assets/img/halloween-logo.png";

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
      halloweenLogo,
    };
  },

  computed: {
    ...mapState(["theme"]),
  },
};
