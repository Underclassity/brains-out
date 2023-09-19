import vuejsStorage from "vuejs-storage";

import { createStore } from "vuex";

import roundValue from "../helpers/round-value.js";

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
    pitSize: "5x5x12",
    pitSizes: ["5x5x12", "10x10x12", "7x5x12"],

    blocksType: "flat",
    blocksTypeOptions: ["flat", "basic", "extended"],

    fov: 70,
    lightPower: 5000,

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

    updateScore(state, value) {
      state.score += value;
    },

    changeBlockType(state, newBlockType) {
      state.blocksType = newBlockType;
    },

    updatePitSize(state, newPitSizeString) {
      if (!state.pitSizes.includes(newPitSizeString)) {
        return false;
      }

      const [pitWidth, pitHeight, pitDepth] = newPitSizeString.split("x");

      state.pitWidth = pitWidth;
      state.pitHeight = pitHeight;
      state.pitDepth = pitDepth;

      state.pitSize = newPitSizeString;
    },

    updateVolume(state, value) {
      let newVolume = roundValue(state.volume + value);

      // Restrain volume
      if (newVolume <= 0) {
        newVolume = 0;
      }

      if (newVolume >= 1) {
        newVolume = 1;
      }

      state.volume = newVolume;
    },

    setVolume(state, newVolume) {
      // Restrain volume
      if (newVolume <= 0) {
        newVolume = 0;
      }

      if (newVolume >= 1) {
        newVolume = 1;
      }

      state.volume = roundValue(newVolume);
    },

    updateFxVolume(state, value) {
      let newVolume = roundValue(state.fxVolume + value);

      // Restrain volume
      if (newVolume <= 0) {
        newVolume = 0;
      }

      if (newVolume >= 1) {
        newVolume = 1;
      }

      state.fxVolume = newVolume;
    },

    setFxVolume(state, newVolume) {
      // Restrain volume
      if (newVolume <= 0) {
        newVolume = 0;
      }

      if (newVolume >= 1) {
        newVolume = 1;
      }

      state.fxVolume = roundValue(newVolume);
    },

    updateBlockType(state, newBlockType) {
      if (!state.blocksTypeOptions.includes(newBlockType)) {
        return false;
      }

      state.blocksType = newBlockType;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    vuejsStorage({
      keys: [
        "size",
        "pitWidth",
        "pitHeight",
        "pitDepth",
        "pitSize",
        "blocksType",
        "fov",
        "volume",
        "fxVolume",
      ],
      namespace: "brains-out",
      driver: vuejsStorage.drivers.sessionStorage,
      //if you want to use sessionStorage instead of localStorage
    }),
  ],
});
