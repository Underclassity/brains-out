import makeEta from "simple-eta";

import { createStore } from "vuex";
import vuejsStorage from "vuejs-storage";

import log from "../helpers/log.js";
import roundValue from "../helpers/round-value.js";

import achievements from "./achievements.js";

export const store = createStore({
  state: {
    size: 1,

    minSpeed: 0.5,
    speed: 0.5,
    settingsSpeed: 0.5,
    maxSpeed: 10,
    speedStep: 0.1,

    score: 0,
    lsScore: [],

    endGameCounter: 0,

    pitWidth: 5,
    pitHeight: 5,
    pitDepth: 12,
    pitSize: "5x5x12",
    pitSizes: ["5x5x12", "10x10x12", "7x5x12"],

    blocksType: "flat",
    blocksTypeOptions: ["flat", "basic", "extended"],

    fov: 70,
    pixelRatio: 1,
    antialias: true,
    isShaders: false,
    lightPower: 5000,

    gridColor: 0x9b_43_0e,
    lightColor: 0xff_ff_ff,
    sceneColor: 0xfa_fa_fa,
    firstLightColor: 0x85_8a_ff,
    secondLightColor: 0xff_b0_7e,
    thirdLightColor: 0xff_00_03,
    specularColor: 0x00_00_00,
    gridFirstColor: 0xcf_cf_cf,
    gridSecondColor: 0xff_ff_ff,

    changeSpeedByLevels: true,

    isEndless: false,
    isPractice: false,

    isDev: false,
    isControls: false,
    isVibration: true,
    isPitGrid: true,

    isAccepted: false,

    isGamepad: false,

    isRandomColor: false,
    isColorizeLevel: true,

    volume: 0.1,
    fxVolume: 0.3,

    version: import.meta.env.VITE_APP_VERSION,
    appVersion: import.meta.env.APP_VERSION,

    // isRotateRestrain: false,
    // maxRotate: 5,
    // rotateCount: 0,

    eta: makeEta({ min: 0, max: 100, autostart: true }),

    achievements,

    userAchievements: [],
  },
  getters: {
    isAccepted(state) {
      return state.isAccepted;
    },

    maxScore(state) {
      return state.lsScore.length ? Math.max(...state.lsScore) : 0;
    },

    minScore(state) {
      return state.lsScore.length ? Math.min(...state.lsScore) : 0;
    },

    avgScore(state) {
      return state.lsScore.length
        ? state.lsScore.reduce((prev, curr) => {
            return prev + curr;
          }, 0) / state.lsScore.length
        : 0;
    },
  },
  mutations: {
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

    updateSpeed(state, value) {
      let newSpeed = roundValue(state.speed + value);

      if (newSpeed >= state.maxSpeed) {
        newSpeed = state.maxSpeed;
      }

      if (newSpeed <= state.minSpeed) {
        newSpeed = state.minSpeed;
      }

      if (state.speed != newSpeed) {
        state.speed = newSpeed;
      }
    },

    setSpeed(state, newSpeed) {
      if (newSpeed >= state.maxSpeed) {
        newSpeed = state.maxSpeed;
      }

      if (newSpeed <= state.minSpeed) {
        newSpeed = state.minSpeed;
      }

      if (state.speed != newSpeed) {
        state.speed = newSpeed;
      }
    },

    updateSettingsSpeed(state, value) {
      let newSpeed = roundValue(state.settingsSpeed + value);

      if (newSpeed >= state.maxSpeed) {
        newSpeed = state.maxSpeed;
      }

      if (newSpeed <= state.minSpeed) {
        newSpeed = state.minSpeed;
      }

      if (state.settingsSpeed != newSpeed) {
        state.settingsSpeed = newSpeed;
      }
    },

    setSettingsSpeed(state, newSpeed) {
      if (newSpeed >= state.maxSpeed) {
        newSpeed = state.maxSpeed;
      }

      if (newSpeed <= state.minSpeed) {
        newSpeed = state.minSpeed;
      }

      if (state.settingsSpeed != newSpeed) {
        state.settingsSpeed = newSpeed;
      }
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

    updateScore(state, value) {
      let newScore = roundValue(state.score + value);

      // Restrain volume
      if (newScore <= 0) {
        newScore = 0;
      }

      state.score = newScore;
    },

    setVolume(state, newScore) {
      // Restrain volume
      if (newScore <= 0) {
        newScore = 0;
      }

      state.score = roundValue(newScore);
    },

    saveScore(state) {
      state.lsScore.push(state.score);
    },

    resetScore(state) {
      state.score = 0;
    },

    reportETA(state, percent) {
      state.eta.report(percent * 100);
    },

    enableControls(state) {
      state.isControls = true;
    },

    disableControls(state) {
      state.isControls = false;
    },

    updateControls(state, value) {
      state.isControls = value ? true : false;
    },

    enableDev(state) {
      state.isDev = true;
    },

    disableDev(state) {
      state.isDev = false;
    },

    updateDev(state, value) {
      state.isDev = value ? true : false;
    },

    enableEndless(state) {
      state.isEndless = true;
    },

    disableEndless(state) {
      state.isEndless = false;
    },

    updateEndless(state, value) {
      state.isEndless = value ? true : false;
    },

    enablePractice(state) {
      state.isPractice = true;

      // Set to 5x5x12
      state.pitWidth = 5;
      state.pitHeight = 5;
      state.pitDepth = 12;

      state.pitSize = "5x5x12";

      // Blocks type flat only
      state.blocksType = "flat";

      return true;
    },

    disablePractice(state) {
      state.isPractice = false;
    },

    updatePractice(state, value) {
      state.isPractice = value ? true : false;

      if (!value) {
        return false;
      }

      // Set to 5x5x12
      state.pitWidth = 5;
      state.pitHeight = 5;
      state.pitDepth = 12;

      state.pitSize = "5x5x12";

      // Blocks type flat only
      state.blocksType = "flat";

      return true;
    },

    enableVibration(state) {
      state.isVibration = true;
    },

    disableVibration(state) {
      state.isVibration = false;
    },

    updateVibration(state, value) {
      state.isVibration = value ? true : false;
    },

    enableGamepad(state) {
      state.isGamepad = true;
    },

    disableGamepad(state) {
      state.isGamepad = false;
    },

    updateGamepad(state, value) {
      state.isGamepad = value ? true : false;
    },

    enableAntialias(state) {
      state.antialias = true;
    },

    disableAntialias(state) {
      state.antialias = false;
    },

    updateAntialias(state, value) {
      state.antialias = value ? true : false;
    },

    enableShaders(state) {
      state.isShaders = true;
    },

    disableShaders(state) {
      state.isShaders = false;
    },

    updateShaders(state, value) {
      state.isShaders = value ? true : false;
    },

    incrementEndGameCounter(state) {
      state.endGameCounter += 1;
    },

    updatePixelRatio(state, value) {
      let newPixelRatio = roundValue(state.pixelRatio + value);

      // Restrain volume
      if (newPixelRatio <= 0) {
        newPixelRatio = 0;
      }

      state.pixelRatio = newPixelRatio;
    },

    setPixelRatio(state, newPixelRatio) {
      // Restrain volume
      if (newPixelRatio <= 0) {
        newPixelRatio = 0;
      }

      state.pixelRatio = roundValue(newPixelRatio);
    },

    enableAccepted(state) {
      state.isAccepted = true;
    },

    disableAccepted(state) {
      state.isAccepted = false;
    },

    updateAccepted(state, value) {
      state.isAccepted = value ? true : false;
    },

    enablePitGrid(state) {
      state.isPitGrid = true;
    },

    disablePitGrid(state) {
      state.isPitGrid = false;
    },

    updatePitGrid(state, value) {
      state.isPitGrid = value ? true : false;
    },

    rotatePit(state) {
      const { pitWidth, pitHeight } = state;

      state.pitWidth = pitHeight;
      state.pitHeight = pitWidth;
    },
  },
  actions: {
    addAchievement({ state }, achievement) {
      if (state.isDev) {
        return false;
      }

      if (state.userAchievements.includes(achievement)) {
        return false;
      }

      state.userAchievements.push(achievement);

      return true;
    },
  },
  modules: {},
  plugins: [
    vuejsStorage({
      keys: [
        "size",
        "settingsSpeed",
        "lsScore",
        "pitWidth",
        "pitHeight",
        "pitDepth",
        "pitSize",
        "blocksType",
        "fov",
        "volume",
        "fxVolume",
        "userAchievements",
        "endGameCounter",
        "isVibration",
        "isAccepted",
      ],
      namespace: "brains-out",
      driver: vuejsStorage.drivers.sessionStorage,
      //if you want to use sessionStorage instead of localStorage
    }),
  ],
});

function parseURLSearchParams() {
  log("Parse URLSearchParams");

  const params = new URLSearchParams(window.location.search);

  for (let [id, value] of params.entries()) {
    if (value == "true") {
      value = true;
    }

    if (value == "false") {
      value = false;
    }

    if (id in store.state) {
      log(`Update ${id}`, value);

      if (["speed", "volume", "fxVolume", "settingsSpeed"].includes(id)) {
        store.state[id] = parseFloat(value, 10);
      } else {
        store.state[id] = value;
      }
    }
  }

  return false;
}

parseURLSearchParams();

export default store;
