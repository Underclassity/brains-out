import makeEta from "simple-eta";

import { createStore } from "vuex";
import vuejsStorage from "vuejs-storage";

import i18n from "../i18n/index.js";

import log from "../helpers/log.js";
import randomBetween from "../helpers/random-between.js";
import roundValue from "../helpers/round-value.js";

import achievements from "./achievements.js";

import colorPalette from "./color-palette.js";

import is from "is_js";

export const store = createStore({
  state: {
    locale: "en",

    size: 1,

    minSpeed: 0.5,
    speed: 0.5,
    settingsSpeed: 0.5,
    maxSpeed: 10,
    speedStep: 0.1,

    isPetrifyDelay: false,
    petrifyDelayStatus: false,
    petrifyDelayMaxTime: 300, // ms

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

    theme: "standard",
    themes: ["standard", "halloween", "simple"],

    fov: 70,
    pixelRatio: window.devicePixelRatio,
    antialias: is.mac() ? false : true,
    isShaders: false,
    lightPower: 5000,
    cameraOffsetDesktop: 2.5,
    cameraOffsetMobile: 1.3,

    isFpsLock: false,
    fpsLockValue: 60,

    gridColor: 0xff_ff_ff,
    lightColor: 0xff_ff_ff,
    sceneColor: 0x12_12_12,
    firstLightColor: 0x85_8a_ff,
    secondLightColor: 0xff_b0_7e,
    thirdLightColor: 0xff_00_03,
    specularColor: 0x00_00_00,
    gridFirstColor: 0xcf_cf_cf,
    gridSecondColor: 0xff_ff_ff,
    skullLight: 0xfa_fa_fa,

    colorPaletteType: "complex",
    colorPaletteTypes: ["flat", "complex"],

    changeSpeedByLevels: true,

    isEndless: false,
    isPractice: false,
    isTimeless: false,
    timelessMaxTime: 2 * 60 * 1000, // 5 sec timer
    timelessTime: 2 * 60 * 1000, // current timer value
    isPitRotating: false,
    isRandomRotate: false,
    isGlitchMayhem: false,
    isSmooth: true,
    isSimple: false,
    randomFiguresCount: 5,
    isColorless: false,
    colorlessColorIndex: 0,
    colorlessMode: "one color",
    colorlessModes: ["one color", "random colors", "chaotic colors"],

    isRotateRestrain: false,
    maxRotate: 5,

    isDev: false,
    isControls: false,
    isVibration: true,
    isPitGrid: true,

    isAccepted: false,

    isGamepad: false,

    isColorizeLevel: true,

    volume: 0.1,
    fxVolume: 0.3,

    version: import.meta.env.VITE_APP_VERSION,
    appVersion: import.meta.env.APP_VERSION,

    eta: makeEta({ min: 0, max: 100, autostart: true }),

    achievements,

    userAchievements: [],

    mode: "original",
    modes: [
      "original",
      "time attack",
      "limited rotations",
      "random rotations",
      "glitch mayhem",
      "pit mess",
      "color madness",
      // "rotating pit",
    ],
  },
  getters: {
    colorPalette(state) {
      return colorPalette[state.colorPaletteType];
    },

    isHalloween(state) {
      return state.theme == "halloween";
    },

    isAccepted(state) {
      return state.isAccepted;
    },

    isRandomColor(state) {
      return (
        state.mode == "color madness" && state.colorlessMode == "random colors"
      );
    },

    isOneColor(state) {
      return (
        state.mode == "color madness" && state.colorlessMode == "one color"
      );
    },

    isAllRandomColor(state) {
      return (
        state.mode == "color madness" && state.colorlessMode == "chaotic colors"
      );
    },

    colorlessColor(state) {
      const palette = colorPalette[state.colorPaletteType];
      return palette[state.colorlessColorIndex];
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
      // if (!state.pitSizes.includes(newPitSizeString)) {
      //   return false;
      // }

      let [pitWidth, pitHeight, pitDepth] = newPitSizeString
        .split("x")
        .map((item) => parseInt(item, 10));

      if (pitWidth <= 5) {
        pitWidth = 5;
      }

      if (pitWidth >= 10) {
        pitWidth = 10;
      }

      if (pitHeight <= 5) {
        pitHeight = 5;
      }

      if (pitHeight >= 10) {
        pitHeight = 10;
      }

      if (pitDepth != 12 && pitDepth != 8) {
        pitDepth = 12;
      }

      state.pitWidth = pitWidth;
      state.pitHeight = pitHeight;
      state.pitDepth = pitDepth;

      state.pitSize = `${pitWidth}x${pitHeight}x${pitDepth}`;
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

    setColorPalette(state, value) {
      if (!state.colorPaletteTypes.includes(value)) {
        return false;
      }

      state.colorPaletteType = value;

      return true;
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

    setTimeless(state, value) {
      state.isTimeless = value;
    },

    setPitRotating(state, value) {
      state.isPitRotating = value;
    },

    setRotationRestrain(state, value) {
      state.isRotateRestrain = value;
    },

    setRandomRotate(state, value) {
      state.isRandomRotate = value;
    },

    setGlitchMayhem(state, value) {
      state.isGlitchMayhem = value;
    },

    setColorless(state, value) {
      state.isColorless = value;
      state.colorlessColorIndex = randomBetween(0, 11);
    },

    setColorlessMode(state, value) {
      if (!state.colorlessModes.includes(value)) {
        return false;
      }

      state.colorlessMode = value;
      state.colorlessColorIndex = randomBetween(0, 11);
    },

    setTimelessMaxTime(state, value) {
      if (value <= 0) {
        value = 1;
      }

      if (value >= 10 * 60 * 1000) {
        value = 10 * 60 * 1000;
      }

      state.timelessMaxTime = value;
    },

    setTimelessTime(state, value) {
      if (value <= 0) {
        value = 0;
      }

      if (value >= state.timelessMaxTime) {
        value = state.timelessMaxTime;
      }

      state.timelessTime = value;
    },

    prevMode(state) {
      let index = state.modes.indexOf(state.mode);
      index--;

      if (index < 0) {
        index = state.modes.length - 1;
      }

      state.mode = state.modes[index];
      return true;
    },

    nextMode(state) {
      let index = state.modes.indexOf(state.mode);
      index++;

      if (index > state.modes.length - 1) {
        index = 0;
      }

      state.mode = state.modes[index];
      return true;
    },

    setMode(state, value) {
      if (!state.modes.includes(value)) {
        return false;
      }

      state.mode = value;
    },

    setMaxRotate(state, value) {
      if (!value || value <= 0) {
        value = 3;
      }

      state.maxRotate = value;
    },

    setSimple(state, value) {
      state.isSimple = value ? true : false;
    },

    setSmooth(state, value) {
      state.isSmooth = value ? true : false;
    },

    setTheme(state, value) {
      if (!state.themes.includes(value)) {
        return false;
      }

      state.theme = value;
    },

    setRandomFiguresCount(state, value) {
      if (value <= 0) {
        value = 0;
      }

      if (value >= 10) {
        value = 10;
      }

      state.randomFiguresCount = value;
    },

    setFpsLock(state, value) {
      state.isFpsLock = value ? true : false;
    },

    setFpsLockValue(state, value) {
      if (value <= 1) {
        value = 1;
      }

      state.fpsLockValue = parseInt(value, 10);
    },

    setCameraOffsetDesktop(state, value) {
      value = parseInt(value, 10);

      if (value <= 0) {
        value = 0;
      }

      if (value >= 10) {
        value = 10;
      }

      state.cameraOffsetDesktop = value;
    },

    setCameraOffsetMobile(state, value) {
      value = parseInt(value, 10);

      if (value <= 0) {
        value = 0;
      }

      if (value >= 10) {
        value = 10;
      }

      state.cameraOffsetMobile = value;
    },

    changeLocale(state, value) {
      state.locale = value;
      i18n.global.locale = value;
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

    addRandomAchievement({ state }) {
      const keys = Object.keys(state.achievements);
      const index = randomBetween(0, keys.length - 1);
      const achievement = keys[index];

      if (state.userAchievements.includes(achievement)) {
        return false;
      }

      state.userAchievements.push(achievement);

      return achievement;
    },

    setPetrifyDelayStatus({ state }, value) {
      state.petrifyDelayStatus = value ? true : false;
    },

    setPetrifyDelayMaxTime({ state }, value) {
      value = parseInt(value, 10);

      if (value <= 0) {
        value = 0;
      }

      state.petrifyDelayMaxTime = value;
    },

    setPetrifyDelay({ state }, value) {
      state.isPetrifyDelay = value ? true : false;
    },
  },
  modules: {},
  plugins: [
    vuejsStorage({
      keys: [
        "locale",
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
        "theme",
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

      store.state[id] = [
        "speed",
        "volume",
        "fxVolume",
        "settingsSpeed",
      ].includes(id)
        ? parseFloat(value, 10)
        : value;
    }
  }

  return false;
}

parseURLSearchParams();

export default store;
