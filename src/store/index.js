import { createStore } from "vuex";

export default createStore({
  state: {
    size: 1,
    speed: 1,

    pitWidth: 5,
    pitHeight: 5,
    pitDepth: 12,

    fov: 70,

    pitSize: "5x5x12",

    gridColor: 0x80_80_80,

    lightColor: 0xfa_fa_fa,
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
