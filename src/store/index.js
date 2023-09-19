import { createStore } from "vuex";

export default createStore({
  state: {
    size: 1,

    minSpeed: 0.5,
    speed: 0.5,
    maxSpeed: 10,
    speedStep: 0.1,
    score: 0,
    lsScore: [],
    prevScore: 0,

    pitWidth: 5,
    pitHeight: 5,
    pitDepth: 12,

    blocksType: "flat",

    fov: 70,
    lightPower: 5000,

    pitSize: "5x5x12",

    gridColor: 0x9b_43_0e,
    lightColor: 0xfa_fa_fa,
    sceneColor: 0x00_0b_12,

    changeSpeedByLevels: true,

    isDev: false,

    isRandomColor: false,
    isColorizeLevel: true,

    volume: 0.1,
    fxVolume: 0.7,

    isRotateRestrain: false,
    maxRotate: 5,
    rotateCount: 0,
  },
  getters: {},
  mutations: {
    incrementSpeed(state) {
      state.speed += state.minSpeed;
    },

    resetSpeed(state) {
      state.speed = state.minSpeed;
    },

    updateScore(state, n) {
      state.score += n;
    },

    changeBlockType(state, newBlockType) {
      state.blocksType = newBlockType;
    },

    updatePitSize(state, newPitSizeString) {
      const [pitWidth, pitHeight, pitDepth] = newPitSizeString.split("x");

      state.pitWidth = pitWidth;
      state.pitHeight = pitHeight;
      state.pitDepth = pitDepth;

      state.pitSize = newPitSizeString;
    },
  },
  actions: {},
  modules: {},
});
