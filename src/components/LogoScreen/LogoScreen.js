import { mapState } from "vuex";

import halloweenLogo from "../../assets/img/halloween-logo.png";
import logoSrc from "../../assets/img/green-logo.png";
import simpleLogo from "../../assets/img/simple-logo.png";

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
      halloweenLogo,
      logoSrc,
      simpleLogo,
    };
  },

  computed: {
    ...mapState(["theme"]),

    imgSrc() {
      const { theme, halloweenLogo, simpleLogo, logoSrc } = this;

      if (theme == "halloween") {
        return halloweenLogo;
      }

      if (theme == "simple") {
        return simpleLogo;
      }

      return logoSrc;
    },
  },
};
