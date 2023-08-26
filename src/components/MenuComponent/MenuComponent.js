export default {
  name: "MenuComponent",

  props: {
    isMenu: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    closeMenu() {
      console.log("Close menu");
      this.$emit("close-menu");
    },
  },
};
