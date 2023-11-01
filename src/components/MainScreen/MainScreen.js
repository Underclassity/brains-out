import { defineAsyncComponent, nextTick } from "vue";
import { mapState, mapGetters } from "vuex";

import {
  Clock,
  Color,
  FogExp2,
  Group,
  MathUtils,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import * as TWEEN from "@tweenjs/tween.js";

import { loadParts, loadHalloweenParts } from "../../helpers/load-zombie.js";
import { textureLoaderHelper } from "../../helpers/load-texture.js";
// import getGroupSize from "../../helpers/get-group-size.js";
import getWorldPosisition from "../../helpers/get-world-position.js";
import generatePit from "../../helpers/generate-pit.js";
import log from "../../helpers/log.js";
import randomBetween from "../../helpers/random-between.js";
import roundValue from "../../helpers/round-value.js";

import {
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  playRandomRotateSound,
  randomRotate,
  rotateXMinus,
  rotateXPlus,
  rotateYMinus,
  rotateYPlus,
  rotateZMinus,
  rotateZPlus,
} from "./move.js";
import {
  positionHelper,
  rotateHelper,
  translateHelper,
} from "./transform-helpers.js";
import {
  initAudio,
  initBgSound,
  initBgMenuSound,
  initDropSound,
  initEndSound,
  initClearSound,
  initRotateSounds,
} from "./init-audio.js";
import {
  // initLevelPreview,
  // updateLayersPreview,
  isLayerVisible,
} from "./init-pit-levels.js";
import { initLights } from "./init-lights.js";
import {
  initLayer,
  initLayers,
  initLayerHelpers,
  setLayerPoint,
  updateLayersView,
} from "./init-layers.js";
import { initWaterfall, createElement } from "./waterfall.js";
import { initTweakPane } from "./init-tweakpane.js";
import { initJoyPad, initKeyBoard } from "./init-inputs.js";
import colorizeElement from "./colorize-element.js";
import initShaders from "./init-shaders.js";
import getRandomForm from "./get-random-form.js";
import initPoints from "./init-points.js";

export default {
  name: "MainScreen",

  data() {
    return {
      prevScore: 0,

      // Init like 12 points depth pit
      layers: new Array(12),
      layersElements: new Array(12),
      layersHelpers: {},
      elements: [],
      pitLevels: undefined,

      delta: 0,
      timeDelta: 0,
      second: 0,

      isPause: true,
      isMenu: true,
      isSmooth: true,
      isSimple: false,
      isEnd: false,
      isInstanced: true,
      isPetrify: false,
      isFastDrop: true,
      isLevelHelpers: false,
      isFirstTime: false,
      isTest: false,
      isDevControlsOpened: true,

      isHalloween: true,
      halloweenBlocksCount: 3,

      changeSpeedByLevels: true,

      isMobile: false,

      viewWidth: undefined,
      viewHeight: undefined,

      isAccepted: false,
      isLogo: false,
      isControlsInfo: false,
      isControlsInfoShowed: false,
      isControlsInfoPlay: false,

      isLoading: true,
      loadingProcessCache: {},

      isRandomColor: false,
      isRandomCorner: false,
      isColorizeLevel: true,
      isOldColorize: false,
      isRotateAnimation: false,
      isRotating: false,

      randomFormsCount: 5,

      // Modes
      fog: undefined,
      fogColor: 0xcccccc,
      fogDensity: 0.1,
      isFog: false,

      isSlow: false,
      slowValue: 100,
      slowDivider: 0,

      // Helpers
      orbitControls: false,
      helpers: false,

      showScore: 0,
      showSpeed: 0,
      showBestScore: 0,
      scoreIncrement: 0,
      scoreIncrementType: "points",

      bgSoundId: "ZombiesAreComing.aac",
      bgMenuSoundId: "Rising.aac",
      fallSoundId: ["burp_01.aac", "burp_02.aac"],
      rotationSoundId: ["cloth3.aac"],
      endGameSoundId: "zombieHoouw_1.aac",
      levelSoundId: "Zombie Sound.aac",

      bgSound: undefined,
      bgMenuSound: undefined,
      endSound: undefined,
      clearSound: undefined,
      rotateSounds: {},
      dropSounds: {},

      isWindowFocus: true,

      camera: undefined,
      scene: undefined,
      renderer: undefined,
      renderInfo: undefined,
      stats: undefined,
      controls: undefined,
      pit: undefined,
      gamepad: undefined,

      composer: undefined,

      lights: {
        l1: undefined,
        l2: undefined,
        l3: undefined,
      },

      resizeTimeout: undefined,

      isRotateRestrain: false,
      maxRotate: 5,
      rotateCount: 0,

      isPrevCleared: false,
      movesCounter: 0,

      prevColor: undefined,
      prevCorner: undefined,
      current: undefined,
      next: undefined,

      zombieParts: [],
      pitParts: [],
      candleParts: [],

      // Atlases
      greyAtlas: undefined,
      greyBrains: undefined,
      greyGuts: undefined,

      fps: 0,
      frameTime: 0,
      frames: 0,
      prevTime: Date.now(),

      loopCb: [],

      xCPoints: [],
      yCPoints: [],
      zCPoints: [],
      xPoints: [],
      yPoints: [],
      zPoints: [],

      error: false,
    };
  },

  components: {
    MenuScreen: defineAsyncComponent(() =>
      import("../MenuScreen/MenuScreen.vue")
    ),
    AcceptBugsScreen: defineAsyncComponent(() =>
      import("../AcceptBugsScreen/AcceptBugsScreen.vue")
    ),
    ControlsBlock: defineAsyncComponent(() =>
      import("../ControlsBlock/ControlsBlock.vue")
    ),
    ControlsInfoScreen: defineAsyncComponent(() =>
      import("../ControlsInfoScreen/ControlsInfoScreen.vue")
    ),
    LoadingScreen: defineAsyncComponent(() =>
      import("../LoadingScreen/LoadingScreen.vue")
    ),
    LogoScreen: defineAsyncComponent(() =>
      import("../LogoScreen/LogoScreen.vue")
    ),
  },

  computed: {
    ...mapState([
      "size",

      "volume",
      "fxVolume",

      "pitWidth",
      "pitHeight",
      "pitDepth",
      "pitSize",

      "blocksTypeOptions",
      "blocksType",

      "colorPaletteType",
      "colorPaletteTypes",

      "fov",
      "pixelRatio",
      "antialias",
      "isShaders",
      "lightPower",

      "minSpeed",
      "speed",
      "settingsSpeed",
      "maxSpeed",
      "speedStep",

      "isTimeless",
      "timelessMaxTime",
      "timelessTime",

      "isEndless",
      "isPractice",

      "score",
      "lsScore",
      "endGameCounter",

      "isDev",
      "isControls",
      "isVibration",
      "isPitGrid",

      // Colors
      "gridColor",
      "lightColor",
      "sceneColor",
      "firstLightColor",
      "secondLightColor",
      "thirdLightColor",
      "specularColor",
      "gridFirstColor",
      "gridSecondColor",
      "skullLight",
    ]),

    ...mapGetters(["maxScore", "minScore", "avgScore", "colorPalette"]),

    zombie() {
      const { scene } = this;

      return scene.children.find((item) => item.userData.name == "Zombie");
    },

    time() {
      if (this.isPractice) {
        return 0;
      }

      return this.isSmooth ? this.timeDelta : this.second;
    },

    loadPercent() {
      const { loadingProcessCache } = this;

      let count = 4;

      count += this.fallSoundId.length;
      count += this.rotationSoundId.length;

      count++;

      // Atlases
      count += 3;

      // // Dev parts
      count++;

      // // 10 objects to download
      // const count = 10;

      let totalCount = 0;

      for (const id in loadingProcessCache) {
        totalCount += loadingProcessCache[id].percent;
      }

      return totalCount / count;
    },

    levelsOffsetStyle() {
      const { viewWidth, pitWidth, size, isMobile, isControls } = this;

      if (!viewWidth || isMobile || isControls) {
        return "";
      }

      const leftPercent =
        ((viewWidth / 2 - pitWidth / 2 - size) / viewWidth) * 100;

      return `left:calc(${leftPercent}% - 90px / 2);`;
    },
  },

  methods: {
    log() {
      return log(`[${this.$options.name}]:`, ...arguments);
    },

    /**
     * Update render side
     *
     * @return  {Boolean}  Result
     */
    async updateRendererSize() {
      this.isMobile =
        window.innerWidth / window.innerHeight < 1 && window.innerWidth < 1024;

      await nextTick();

      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.log("Resize call");

        const { container } = this.$refs;

        const containerRect = container.getBoundingClientRect();

        // Set mobile flag

        this.camera.aspect = containerRect.width / containerRect.height;
        this.camera.updateProjectionMatrix();

        if (this.controls) {
          this.controls.update();
        }

        this.renderer.setSize(containerRect.width, containerRect.height);
        // this.composer.setSize(containerRect.width, containerRect.height);

        this.updateCameraProjection();
        this.reCreatePit(this.pitSize);
      }, 10);

      return true;
    },

    /**
     * Update camera projection
     *
     * @return  {Boolean}  Result
     */
    updateCameraProjection() {
      const { camera, controls, pitWidth, pitHeight, pitDepth } = this;

      this.log(
        `Update camera projection call: ${pitWidth}-${pitHeight}-${pitDepth}`
      );

      const offset = camera.aspect > 1 ? 2.5 : 0;

      const maxSize = Math.max(pitWidth, pitHeight, 0) + offset;
      const fitHeightDistance =
        maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      let distance = 2 * Math.max(fitHeightDistance, fitWidthDistance);

      const vFOV = MathUtils.degToRad(camera.fov); // convert vertical fov to radians

      this.viewHeight = 2 * Math.tan(vFOV / 2) * (distance - maxSize); // visible height
      this.viewWidth = this.viewHeight * camera.aspect; // visible width

      let viewWidthDiff = (this.viewWidth - pitWidth) / 2;
      let viewHeightDiff = (this.viewHeight - pitHeight) / 2;

      let counter = 0;

      while (viewWidthDiff > 2 && viewHeightDiff > 2 && counter <= 10) {
        distance -= 0.5;
        this.viewHeight = 2 * Math.tan(vFOV / 2) * (distance - maxSize);
        this.viewWidth = this.viewHeight * camera.aspect;

        viewWidthDiff = (this.viewWidth - pitWidth) / 2;
        viewHeightDiff = (this.viewHeight - pitHeight) / 2;

        counter++;
      }

      if (this.cameraPositionTween) {
        this.cameraPositionTween.stop();
      }

      this.cameraPositionTween = new TWEEN.Tween({
        value: camera.position.z,
      });
      this.cameraPositionTween.easing(TWEEN.Easing.Quadratic.In);
      this.cameraPositionTween.to({ value: distance - maxSize }, 300);
      this.cameraPositionTween.onUpdate(({ value }) => {
        camera.position.setZ(value);
      });

      // Start tween after re-create pit
      setTimeout(() => {
        this.cameraPositionTween.start();
      }, 0);

      if (controls) {
        controls.update();
      }

      this.updatePreview();

      return true;
    },

    /**
     * Update bg sound playbackrate based on current speed
     *
     * @return  {Boolean}                 Result
     */
    updatePlaybackRate() {
      const newPlaybackRate =
        (this.speed - this.minSpeed) / this.speedStep / 10 / 7 + 1;

      this.log("Update bg playbackrate to: ", newPlaybackRate);

      if (this.bgSound) {
        this.log("Change bg sound playbackrate to: ", newPlaybackRate);

        this.pauseBgSound();
        this.bgSound.playbackRate = newPlaybackRate;
        this.playBgSound();
      }

      return true;
    },

    /**
     * Update speed by up value
     *
     * @return  {Boolean}  Result
     */
    speedUp() {
      if (this.isEndless) {
        return false;
      }

      this.$store.commit("updateSpeed", this.speedStep);

      this.log("Update speed to: ", this.speed);

      this.updatePlaybackRate();

      return true;
    },

    /**
     * Change score value
     *
     * @param   {Number}  changeValue      Value diff
     * @param   {String}  [type=points]    Type of score update
     *
     * @return  {Boolean}                  Result
     */
    changeScore(changeValue, type = "points") {
      if (this.isPractice) {
        return false;
      }

      this.$store.commit("updateScore", changeValue);

      this.scoreIncrementType = type;

      if (this.changeSpeedByLevels) {
        this.prevScore = this.score;
      } else if (this.score - this.prevScore >= 50) {
        this.prevScore = this.score;
        this.speedUp();
      }

      return true;
    },

    /**
     * Accepted call press
     *
     * @return  {Boolean}  Result
     */
    acceptedCall() {
      if (this.isTest) {
        return false;
      }

      this.log("Accepted call");
      this.isAccepted = true;
      this.isLogo = true;

      setTimeout(() => {
        this.isLogo = false;

        this.isPause = true;
        this.isMenu = true;
        this.isLogo = false;

        this.emitter.emit("openStartMenu");
      }, 2000);

      return true;
    },

    /**
     * Open menu call
     *
     * @return  {Boolean}  Result
     */
    openMenu() {
      this.log("Open menu");

      this.isPause = true;
      this.isMenu = true;
      this.isLogo = false;

      this.emitter.emit("openMenu");

      return true;
    },

    /**
     * Close menu call
     *
     * @param   {Boolean}  [emit=true]  Emitter call flag
     *
     * @return  {Boolean}               Result
     */
    closeMenu(emit = true) {
      this.log("Close menu");

      this.isPause = false;
      this.isMenu = false;
      this.isLogo = false;

      if (emit) {
        this.emitter.emit("closeMenu");
      }

      return true;
    },

    /**
     * New game call helper
     *
     * @param   {Boolean}  [isPractice=false]  Practice flag
     *
     * @return  {Boolean}                      Result
     */
    newGameCall(isPractice = false) {
      this.log("New game caller: ", isPractice);

      this.$store.commit("updatePractice", isPractice);

      if (!this.isControlsInfoShowed) {
        this.isControlsInfoPlay = true;
        this.openControlsInfo(true, true);
        return true;
      }

      this.isControlsInfoPlay = false;

      this.closeMenu();
      this.newGame();

      return true;
    },

    /**
     * Back to game call helper
     *
     * @return  {Boolean}  Result
     */
    backToGameCall() {
      this.closeMenu(false);

      return true;
    },

    /**
     * Pause call helper
     *
     * @return  {Boolean}  Result
     */
    pauseCall() {
      this.log("Pause call");
      this.isPause = true;

      return true;
    },

    /**
     * Play call helper
     *
     * @return  {Boolean}  Result
     */
    playCall() {
      this.log("Play call");
      this.isPause = false;

      return true;
    },

    /**
     * Change smooth flag helper
     *
     * @param   {Boolean}  isSmooth  New smooth flag
     *
     * @return  {Boolean}            Result
     */
    updateSmooth(isSmooth) {
      this.isSmooth = isSmooth;
      this.log(`Smooth updated: ${this.isSmooth}`);

      return true;
    },

    /**
     * Update instanced flag
     *
     * @param   {Boolean}  isInstanced  New instanced flag
     *
     * @return  {Boolean}               Result
     */
    updateInstanced(isInstanced) {
      this.isInstanced = isInstanced;
      this.log(`Instanced updated: ${this.isInstanced}`);

      this.newGame();

      return true;
    },

    updateSimple(isSimple) {
      this.isSimple = isSimple ? true : false;
      this.log(`Simple updated: ${this.isSimple}`);
      this.newGame();
    },

    updateControls() {
      this.updateRendererSize();
      this.log(`Controls updated: ${this.isControls}`);
    },

    updateSound(sound) {
      this.bgSoundId = sound;
      this.log(`Update sound: ${sound}`);

      this.initAudio();
    },

    /**
     * Update volume helper
     *
     * @param   {Number}  volume  New volume value
     *
     * @return  {Boolean}         Result
     */
    updateVolume(volume) {
      this.log(`Update volume: ${volume}`);

      if (this.bgSound) {
        this.bgSound.setVolume(volume);
      }

      if (this.bgMenuSound) {
        this.bgMenuSound.setVolume(volume);
      }
    },

    /**
     * Update FX volume
     *
     * @param   {Number}  fxVolume  New FX volume value
     *
     * @return  {Boolean}           Result
     */
    updateFxVolume(fxVolume) {
      this.log(`Update FX volume: ${fxVolume}`);

      for (const id in this.dropSounds) {
        this.dropSounds[id].setVolume(fxVolume);
      }

      if (this.endSound) {
        this.endSound.setVolume(fxVolume);
      }

      if (this.clearSound) {
        this.clearSound.setVolume(fxVolume);
      }

      for (const id in this.rotateSounds) {
        this.rotateSounds[id].setVolume(fxVolume);
      }

      return true;
    },

    /**
     * Update blocks type helper
     *
     * @param   {String}  blocksType  New blocks type
     *
     * @return  {Boolean}             Result
     */
    updateBlocksType(blocksType) {
      this.log(`Update blocks type: ${blocksType}`);
      return true;
    },

    /**
     * New game call helper
     *
     * @return  {Boolean}  Result
     */
    newGame() {
      this.log("New game call");

      // Reset score and speed
      this.$store.commit("resetScore");
      this.$store.commit("setSpeed", this.settingsSpeed);

      this.showSpeed = this.speed;

      this.updatePlaybackRate();

      this.isEnd = false;
      this.isPetrify = false;

      // Reset slow params
      this.isSlow = false;
      this.slowValue = 100;

      this.movesCounter = 0;

      if (this.lights?.l1 && this.lights?.l2 && this.lights?.l3) {
        this.lights.l1.power = this.lightPower;
        this.lights.l1.visible = true;
        this.lights.l2.power = this.lightPower;
        this.lights.l2.visible = true;
        this.lights.l3.power = 0;
        this.lights.l3.visible = false;
      }

      // reset elements array
      if (this.elements.length) {
        this.elements.forEach((item) => {
          this.removeObjWithChildren(item);
        });
      }

      for (const layer of this.layersElements) {
        for (const mesh of layer) {
          if (!mesh) {
            continue;
          }

          this.removeObjWithChildren(mesh);
        }
      }

      if (this.current) {
        this.removeObjWithChildren(this.current);
        this.current = undefined;
      }

      if (this.next) {
        this.removeObjWithChildren(this.next);
        this.next = undefined;
      }

      this.elements = [];

      // Init layers after resize
      this.initLayers();
      this.initPoints();

      // this.initLevelPreview();
      // this.updateLayersPreview();

      this.createElement();

      if (this.bgSound) {
        this.bgSound.playbackRate = 1;
      }

      return true;
    },

    initLayer,
    initLayers,
    initLayerHelpers,
    setLayerPoint,
    updateLayersView,

    initAudio,
    initBgSound,
    initBgMenuSound,
    initDropSound,
    initEndSound,
    initClearSound,
    initRotateSounds,

    /**
     * Get layers elements points
     *
     * @return  {Array}  Array with points
     */
    getLayersElementsLevelPoints() {
      return this.layersElements
        .reduce((prev, curr) => {
          prev.push(...curr);
          return prev;
        }, [])
        .filter((item) => item)
        .map((item) => {
          if (item.userData.static && item.userData.layer) {
            const { x, y, z } = item.userData.layer;

            return {
              x,
              y,
              z,
              static: true,
            };
          }

          const itemPosition = getWorldPosisition(item);

          return {
            x: roundValue(itemPosition.x),
            y: roundValue(itemPosition.y),
            z: roundValue(itemPosition.z),
          };
        })
        .map((item) => {
          if (item?.static) {
            const { x, y, z } = item;

            return { x, y, z };
          }

          const x = this.xCPoints.includes(item.x)
            ? this.xCPoints.indexOf(item.x)
            : this.xPoints.indexOf(item.x);

          const y = this.yCPoints.includes(item.y)
            ? this.yCPoints.indexOf(item.y)
            : this.yPoints.indexOf(item.y);

          let z = this.zCPoints.includes(item.z)
            ? this.zCPoints.indexOf(item.z)
            : this.zPoints.indexOf(item.z);

          if (z == -1) {
            this.zCPoints.forEach((point, index, array) => {
              if (z != -1) {
                return true;
              }

              if (item.z <= array[array.length - 1]) {
                z = array.length - 1;
                return true;
              }

              if (item.z >= array[0]) {
                z = 0;
                return true;
              }

              const nextPoint = array[index + 1];

              if (item.z <= point && item.z > nextPoint) {
                z = index;
              }
            });
          }

          return {
            x,
            y,
            z,
          };
        });
    },

    /**
     * Get element layer point for given item
     *
     * @param   {Object}  item  Item
     *
     * @return  {Object}        Points object
     */
    getElementLayerPointsForItem(item) {
      const itemPosition = getWorldPosisition(item);

      const positionObject = {
        x: roundValue(itemPosition.x, 1),
        y: roundValue(itemPosition.y, 1),
        z: roundValue(itemPosition.z, 1),
      };

      const x = this.xCPoints.includes(positionObject.x)
        ? this.xCPoints.indexOf(positionObject.x)
        : this.xPoints.indexOf(positionObject.x);

      const y = this.yCPoints.includes(positionObject.y)
        ? this.yCPoints.indexOf(positionObject.y)
        : this.yPoints.indexOf(positionObject.y);

      let z = this.zCPoints.includes(positionObject.z)
        ? this.zCPoints.indexOf(positionObject.z)
        : this.zPoints.indexOf(positionObject.z);

      if (z == -1) {
        this.zCPoints.forEach((point, index, array) => {
          if (z != -1) {
            return true;
          }

          if (positionObject.z <= array[array.length - 1]) {
            z = array.length - 1;
            return true;
          }

          if (positionObject.z >= array[0]) {
            z = 0;
            return true;
          }

          const nextPoint = array[index + 1];

          if (positionObject.z <= point && positionObject.z > nextPoint) {
            z = index;
          }
        });
      }

      return {
        x,
        y,
        z,
        uuid: item.uuid,
      };
    },

    /**
     * Get element layers points
     *
     * @param   {Object}  element  Element
     *
     * @return  {Array}            Points array
     */
    getElementLayerPoints(element) {
      return element
        .getObjectByName("childs")
        .children.map((item) => this.getElementLayerPointsForItem(item));
    },

    /**
     * Find element indexes
     *
     * @param   {Object}  child  Element
     *
     * @return  {Object}         Indexes object
     */
    findElementIndexes(child) {
      const { xCPoints, yCPoints, zPoints, size } = this;

      const half = size / 2;

      const position = getWorldPosisition(child);

      let { x, y, z } = position;

      if (child.userData.layer) {
        return {
          x: child.userData.layer.x,
          y: child.userData.layer.y,
          z: child.userData.layer.z,
          pX: x,
          pY: y,
          pZ: z,
          uuid: child.uuid,
        };
      }

      x = Math.round(x * 100) / 100;
      y = Math.round(y * 100) / 100;
      z = Math.round(z * 100) / 100 - half;

      let xIndex = xCPoints.indexOf(x) || -1;
      let yIndex = yCPoints.indexOf(y) || -1;
      let zIndex = zPoints.indexOf(z) || -1;

      if (xIndex == -1) {
        xCPoints.forEach((point, index, array) => {
          if (x >= point && x < array[index + 1]) {
            xIndex = index;
          }
        });
      }

      if (yIndex == -1) {
        yCPoints.forEach((point, index, array) => {
          if (y >= point && y < array[index + 1]) {
            yIndex = index;
          }
        });
      }

      if (zIndex == -1) {
        zPoints.forEach((point, index, array) => {
          if (z < point && z > array[index + 1]) {
            zIndex = index;
          } else if (z <= array[array.length - 1]) {
            zIndex = array.length - 1;
          }
        });
      }

      return {
        x: xIndex,
        y: yIndex,
        z: zIndex,
        pX: x,
        pY: y,
        pZ: z,
        uuid: child.uuid,
      };
    },

    /**
     * Find collision elements helper
     *
     * @param   {Object}  element  Element
     *
     * @return  {Array}            Collision points
     */
    findCollissionElements(element) {
      //this.log(`Find collision elements: ${element.name}`);

      const childs = element.getObjectByName("childs").children;

      const indexes = childs.map(this.findElementIndexes);

      const collisionPoints = [];

      for (const { x, y, z, pX, pY, pZ, uuid } of indexes) {
        for (let zIndex = 0; zIndex < this.zPoints.length; zIndex++) {
          if (this.layers[zIndex + 1] && this.layers[zIndex + 1][x][y]) {
            collisionPoints.push({ x, y, z, pX, pY, pZ, zIndex, uuid });
          }
        }
      }

      return collisionPoints;
    },

    /**
     * Get collision points for element
     *
     * @param   {Object}  element  Element
     *
     * @return  {Object}           Object with points array
     */
    getCollisionPoints(element) {
      const layerPoints = this.getLayersElementsLevelPoints();
      const elementPoints = this.getElementLayerPoints(element);

      let xyPoints = [];
      let zPoints = [];
      let coverPoints = [];

      for (const point of elementPoints) {
        const zCollisionPoints = layerPoints
          .filter((item) => {
            return item.x == point.x && item.y == point.y && point.z < item.z;
          })
          .reduce((prev, curr) => {
            return !prev.length || prev[0].z > curr.z ? [curr] : prev;
          }, [])
          .map((item) => {
            return { dir: "bottom", item, point };
          });

        const xyCollisionPoints = layerPoints
          .filter((item) => item.z == point.z)
          .map((item) => {
            let dir = "left";

            const isRight = item.x - 1 == point.x && item.y == point.y;
            const isLeft = item.x + 1 == point.x && item.y == point.y;
            const isTop = item.y - 1 == point.y && item.x == point.x;
            const isBottom = item.y + 1 == point.y && item.x == point.x;

            if (isRight) {
              dir = "right";
            }

            if (isTop) {
              dir = "top";
            }

            if (isBottom) {
              dir = "bottom";
            }

            const isPoint = isLeft || isRight || isBottom || isTop;

            if (isPoint) {
              return { dir, item, point };
            }

            return false;
          })
          .filter((item) => item);

        const coverCollisionPoints = layerPoints
          .map((item) => {
            const isCover =
              item.x == point.x && item.y == point.y && item.z == point.z;

            if (isCover) {
              return {
                item,
                point,
              };
            }

            return false;
          })
          .filter((item) => item);

        coverPoints.push(...coverCollisionPoints);
        xyPoints.push(...xyCollisionPoints);
        zPoints.push(...zCollisionPoints);
      }

      xyPoints = xyPoints.filter(
        (value, index, array) => array.indexOf(value) === index
      );
      zPoints = zPoints.filter(
        (value, index, array) => array.indexOf(value) === index
      );
      coverPoints = coverPoints.filter(
        (value, index, array) => array.indexOf(value) === index
      );

      return {
        xy: xyPoints,
        z: zPoints,
        points: elementPoints,
        cover: coverPoints,
      };
    },

    /**
     * Collision element check helper
     *
     * @param   {Object}  element  Element
     *
     * @return  {Boolean}          Result
     */
    collisionElement(element) {
      const elementPoints = this.getElementLayerPoints(element);

      let isFreeze = false;

      for (const { x, y, z } of elementPoints) {
        if (isFreeze) {
          continue;
        }

        const layer = this.layers[z + 1];

        if (Array.isArray(layer)) {
          const nextLayerValue = layer[x][y];

          if (nextLayerValue) {
            isFreeze = true;
          }
        } else {
          isFreeze = true;
        }

        // const { x, y, z, pX, pY, pZ } = this.findElementIndexes(child);

        // if (z != -1 && x != -1 && y != -1) {
        //   const layer = this.layers[z + 1];

        //   if (layer) {
        //     if (
        //       layer == undefined ||
        //       layer[x] == undefined ||
        //       layer[x][y] == undefined
        //     ) {
        //       this.error = `Layer not found ${
        //         element.name
        //       }!(${x}/${y}/${z})(${pX.toFixed(1)}/${pY.toFixed(1)}/${pZ.toFixed(
        //         1
        //       )})(${child.position.x.toFixed(1)}/${child.position.y.toFixed(
        //         1
        //       )}/${child.position.z.toFixed(1)})`;
        //       throw new Error(this.error);
        //     }

        //     const nextLayerValue = layer[x][y];

        //     //this.log(
        //     //   this.layers[zIndex + 1].map((xLayer) => xLayer.join("-")).join("\n")
        //     // );

        //     if (nextLayerValue) {
        //       isFreeze = true;
        //     }
        //   } else {
        //     // Reached end
        //     isFreeze = true;
        //   }
        // } else {
        //   this.error = `Index not found ${child.name}!(${x}/${y}/${z})(${pX}/${pY}/${pZ})`;
        //   throw new Error(this.error);
        // }
      }

      return isFreeze;
    },

    /**
     * Drop element key handler helper
     *
     * @return  {Boolean}  Result
     */
    drop() {
      this.vibrateCall(100);

      this.current.userData.drop = true;
      return true;
    },

    /**
     * Drop element helper
     *
     * @param   {Object}  element  Element
     *
     * @return  {Boolean}          Result
     */
    dropElement(element) {
      // this.vibrateCall(100);

      element.userData.drop = true;

      const { z, points } = this.getCollisionPoints(element);

      if (z.length) {
        let minDiff = undefined;

        for (const { item, point } of z) {
          const pointElement = element.getObjectByProperty("uuid", point.uuid);

          const itemPosition = getWorldPosisition(pointElement);

          const layerPosition = this.zCPoints[item.z - 1];

          const diff = layerPosition - itemPosition.z;

          if (minDiff == undefined) {
            minDiff = diff;
          } else if (diff > minDiff) {
            minDiff = diff;
          }
        }

        this.log(`Drop element by Z: ${element.name} - ${minDiff.toFixed(2)}`);

        this.translateHelper(element, "z", minDiff);
      } else if (points.length) {
        const lowerPoint = points.reduce((prev, curr) => {
          if (curr.z > prev.z) {
            return curr;
          }

          return prev;
        }, points[0]);

        const lowerElement = element.getObjectByProperty(
          "uuid",
          lowerPoint.uuid
        );

        const itemPosition = getWorldPosisition(lowerElement);

        const layerPosition = this.zCPoints[this.zCPoints.length - 1];

        const diff = layerPosition - itemPosition.z;

        this.translateHelper(element, "z", diff);

        this.log(
          `Drop element by lower point: ${element.name} - ${diff.toFixed(2)}`
        );
      } else {
        this.translateHelper(
          element,
          "z",
          this.zCPoints[this.zCPoints.length - 1]
        );

        this.log(
          `Drop element in layer point: ${element.name} - ${this.zCPoints[
            this.zCPoints.length - 1
          ].toFixed(2)}`
        );
      }

      this.restrainElement(element);

      // const childs = element.getObjectByName("childs").children;

      // const indexes = childs.map(this.findElementIndexes);

      // const collisionPoints = [];

      // for (const { x, y, z, pX, pY, pZ, uuid, el } of indexes) {
      //   for (let zIndex = 0; zIndex < this.zPoints.length; zIndex++) {
      //     if (this.layers[zIndex + 1] && this.layers[zIndex + 1][x][y]) {
      //       collisionPoints.push({ x, y, z, pX, pY, pZ, zIndex, uuid, el });
      //     }
      //   }
      // }

      // if (collisionPoints.length) {
      //   //this.log(`Found ${collisionPoints.length} collision points`);

      //   const uuids = collisionPoints.map((item) => item.uuid);

      //   const maxZ = Math.max(...collisionPoints.map(({ z }) => z));

      //   const { uuid } = indexes.find(
      //     (item) => item.z === maxZ && uuids.includes(item.uuid)
      //   );
      //   const maxPoint = childs.find((item) => item.uuid === uuid);

      //   const collisionZ = collisionPoints.find(
      //     (item) => item.uuid == uuid
      //   ).zIndex;

      //   const maxPointPosition = new Vector3();
      //   maxPoint.getWorldPosition(maxPointPosition);

      //   const tZ = this.zPoints[collisionZ] - maxPointPosition.z;

      //   this.translateHelper(element, "z", tZ);
      // } else {
      //   this.positionHelper(
      //     element,
      //     "z",
      //     this.zPoints[this.zPoints.length - 1]
      //   );
      //   this.restrainElement(element);
      // }

      return element;
    },

    colorizeElement,

    /**
     * Delete layer helper
     *
     * @param   {Number}  zIndex  Layer index
     *
     * @return  {Boolean}         Result
     */
    deleteLayer(zIndex) {
      const layerElements = this.layersElements[zIndex];

      if (!layerElements.length) {
        return false;
      }

      const { size } = this;

      this.log(`Process layer delete: ${zIndex}`);

      // Update speed level
      if (this.changeSpeedByLevels) {
        this.speedUp();
      }

      // const headElements = layerElements.filter((item) =>
      //   item.name.includes("Head")
      // );

      // if (headElements.length == layerElements.length) {
      //   this.emitter.emit("addAchievement", "zombieland");
      // }

      // Delete all layer elements
      for (const element of layerElements) {
        this.removeObjWithChildren(element);
      }

      // Move all elements upper to 1 block down
      this.layersElements.forEach((elements, index) => {
        if (index < zIndex) {
          elements.forEach((el) => {
            if (!el) {
              return false;
            }

            el.position.setZ(el.position.z - size);
            this.restrainElement(el);

            const { x, y, z } = this.getElementLayerPointsForItem(el);

            el.userData.layer = { x, y, z };
          });
        }
      });

      // Move all elements by one level
      this.layers.splice(zIndex, 1);
      this.layersElements.splice(zIndex, 1);
      this.layers.unshift(0);
      this.layersElements.unshift([]);
      this.initLayer(0);

      const layers = this.layers
        .map((layer, index) => {
          const layerValues = layer.reduce((prev, curr) => {
            prev.push(...curr);
            return prev;
          }, []);

          if (layerValues.includes(1)) {
            return index;
          }

          return false;
        })
        .filter((item) => item);

      this.log(`Layers indexes after delete layer ${zIndex}`, layers);

      this.layersElements.forEach((elements, index) => {
        elements.forEach((el) => {
          this.colorizeElement(el, index);
        });
      });

      this.updateLayersView();

      // console.log(
      //   this.layersElements
      //     .map((elements) => elements.filter((item) => item).length)
      //     .join("-")
      // );

      if (this.clearSound) {
        this.clearSound.play();
      }

      // this.updateLayersPreview();

      return true;
    },

    /**
     * Check layer helper
     *
     * @param   {Boolean}  [random=false]  Check random flag
     * @param   {Boolean}  [force=false]   Force delete flag
     *
     * @return  {Boolean}                  Result
     */
    layersCheck(random = false, force = false) {
      const { layers } = this;

      let filledLevelsCounter = 0;

      for (const [index, zLayer] of layers.entries()) {
        const layerValues = zLayer.reduce((prev, current) => {
          prev.push(...current);

          return prev;
        }, []);

        const randomFlag = random ? Math.random() <= 0.2 : false;

        if (layerValues.includes(0) && !randomFlag && !force) {
          continue;
        }

        this.deleteLayer(index);

        filledLevelsCounter++;
      }

      // Update score by tetris formula: https://en.wikipedia.org/wiki/Tetris
      if (filledLevelsCounter) {
        if (this.isPrevCleared) {
          this.emitter.emit("addAchievement", "speedy-and-glorious");
        }

        this.isPrevCleared = true;

        if (filledLevelsCounter >= 3) {
          this.emitter.emit("addAchievement", "combo");
        }

        const scoreDiff =
          10 * (filledLevelsCounter - 1) * filledLevelsCounter + 10;

        this.log(`Levels ${filledLevelsCounter} score: ${scoreDiff}`);

        this.changeScore(
          scoreDiff,
          filledLevelsCounter >= 3 ? "levels-max" : "levels"
        );
      } else {
        this.isPrevCleared = false;
      }

      return true;
    },

    /**
     * End game call helper
     *
     * @param   {Object}  element   Current element to petrify
     *
     * @return  {Boolean}           Result
     */
    endGameCall(element) {
      if (element) {
        const elementPoints = this.getElementLayerPoints(element);

        this.log(`End game call on element: ${element.name}`);

        this.changeScore(elementPoints.length, "points");
      } else {
        this.log(`End game call`);
      }

      // if (this.score <= this.pitDepth) {
      //   this.emitter.emit("addAchievement", "are-you-playing");
      // }

      if (this.movesCounter == 0) {
        this.emitter.emit("addAchievement", "are-you-playing");
      }

      this.$store.commit("saveScore");

      this.$store.commit("incrementEndGameCounter");

      this.isEnd = true;

      // Reset slow params
      this.isSlow = false;
      this.slowValue = 100;

      this.vibrateCall();

      this.openMenu();
      this.emitter.emit("openEndMenu");

      if (this.lights?.l1 && this.lights?.l2 && this.lights?.l3) {
        this.lights.l1.power = 0;
        this.lights.l1.visible = false;
        this.lights.l2.power = 0;
        this.lights.l2.visible = false;
        this.lights.l3.power = this.lightPower;
        this.lights.l3.visible = true;
      }

      this.removeObjWithChildren(element);

      if (this.endSound) {
        this.endSound.play();
      }

      this.isPetrify = false;

      return true;
    },

    /**
     * Petrify element helper
     *
     * @param   {Object}   element            Element
     * @param   {Boolean}  [updateView=true]  Update preview flag
     *
     * @return  {Boolean}                     Result
     */
    petrify(element, updateView = true) {
      this.isPetrify = true;

      const elementPoints = this.getElementLayerPoints(element);

      for (const { x, y, z, uuid } of elementPoints) {
        const el = element.getObjectByProperty("uuid", uuid);
        const itemPosition = getWorldPosisition(el);

        if (this.layers[z][x][y] || itemPosition.z > 2) {
          this.endGameCall(element);
          return false;
        }

        this.positionHelper(el, "x", itemPosition.x);
        this.positionHelper(el, "y", itemPosition.y);
        this.positionHelper(el, "z", itemPosition.z);

        if (itemPosition.z >= 0) {
          this.positionHelper(el, "z", 0);
        }

        this.setLayerPoint(x, y, z, 1, updateView);

        el.userData.static = true;
        el.userData.layer = {
          x,
          y,
          z,
        };

        el.applyQuaternion(element.getObjectByName("childs").quaternion);

        this.colorizeElement(el, z);

        this.layersElements[z].push(el);
        this.scene.add(el);

        for (const id in this.dropSounds) {
          if (this.dropSounds[id].isPlaying) {
            this.dropSounds[id].stop();
          }
        }

        const randomId = randomBetween(0, this.fallSoundId.length - 1);

        if (this.dropSounds[this.fallSoundId[randomId]]) {
          this.dropSounds[this.fallSoundId[randomId]].play();
        }
      }

      this.changeScore(elementPoints.length, "points");

      // const collisionPoints = this.findCollissionElements(element);

      // const childs = element.getObjectByName("childs").children;

      // const indexes = childs.map(this.findElementIndexes);

      // const position = element.position;

      //this.log(
      //   `Petrify element: ${element.name}(${position.x.toFixed(
      //     1
      //   )}-${position.y.toFixed(1)}-${position.z.toFixed(1)})`
      // );

      // let zOffset = 0;

      // for (let { z, uuid } of indexes) {
      //   const collisionPoint = collisionPoints.find(
      //     (item) => item.uuid == uuid
      //   );

      //   if (!collisionPoint) {
      //     continue;
      //   }

      //   if (!collisionPoint.el.userData.size) {
      //     collisionPoint.el.userData.size = getGroupSize(collisionPoint.el);
      //   }

      //   if (
      //     collisionPoint &&
      //     (collisionPoint.z != collisionPoint.zIndex ||
      //       collisionPoint.z != z ||
      //       collisionPoint.zIndex != z)
      //   ) {
      //     const zIndexDiff = collisionPoint.zIndex - collisionPoint.z;

      //     if ((!zOffset || zOffset != zIndexDiff) && zIndexDiff < 0) {
      //       zOffset = zIndexDiff;
      //     }
      //   }
      // }

      // for (let { x, y, z, pX, pY, pZ, el } of indexes) {
      //   z += zOffset;

      //   const layer = this.layers[z];

      //   if (z != -1 && x != -1 && y != -1) {
      //     if (
      //       layer == undefined ||
      //       layer[x] == undefined ||
      //       layer[x][y] == undefined
      //     ) {
      //       this.error = `Element not found in layers!(${x}/${y}/${z})(${pX}/${pY}/${pZ})`;
      //       throw new Error(this.error);
      //     }

      //     if (layer[x][y] && !element.userData.drop) {
      //       this.changeScore(indexes.length);
      //       this.$store.commit("saveScore");

      //      this.log(
      //         `Element already petrified!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
      //       );
      //       this.isEnd = true;
      //       this.openMenu();

      //       this.emitter.emit("openEndMenu");

      //       if (this.lights?.l1 && this.lights?.l2 && this.lights?.l3) {
      //         this.lights.l1.power = 0;
      //         this.lights.l1.visible = false;
      //         this.lights.l2.power = 0;
      //         this.lights.l2.visible = false;
      //         this.lights.l3.power = this.lightPower;
      //         this.lights.l3.visible = true;
      //       }

      //       this.removeObjWithChildren(element);

      //       if (this.endSound) {
      //         this.endSound.play();
      //       }
      //       return false;
      //     }

      //     this.changeScore(1);

      //     this.setLayerPoint(x, y, z);

      //     this.positionHelper(el, "x", pX);
      //     this.positionHelper(el, "y", pY);
      //     this.positionHelper(el, "z", this.zPoints[z] - this.size / 2);

      //     el.userData.static = true;
      //     el.userData.layer = {
      //       x,
      //       y,
      //       z,
      //     };

      //     this.colorizeElement(el, z);

      //     this.layersElements[z].push(el);
      //     this.scene.add(el);

      //     for (const id in this.dropSounds) {
      //       if (this.dropSounds[id].isPlaying) {
      //         this.dropSounds[id].stop();
      //       }
      //     }

      //     const randomId = randomBetween(0, this.fallSoundId.length - 1);

      //     if (this.dropSounds[this.fallSoundId[randomId]]) {
      //       this.dropSounds[this.fallSoundId[randomId]].play();
      //     }
      //   } else {
      //     this.error = `Index not found!(${x}/${y}/${z})(${pX}/${pY}/${pZ})`;
      //     throw new Error(this.error);
      //   }
      // }

      // Remove element after process layers
      this.removeObjWithChildren(element);

      // Check layers
      this.layersCheck();

      // this.updateLayersPreview();

      //this.log(
      //   this.layers
      //     .map((layer) => {
      //       return layer.map((xLayer) => xLayer.join("-")).join("\n");
      //     })
      //     .join("\n" + new Array(pitWidth).join("-") + "\n")
      // );

      this.isPetrify = false;

      return true;
    },

    positionHelper,
    rotateHelper,
    translateHelper,

    moveUp,
    moveDown,
    moveLeft,
    moveRight,

    randomRotate,
    rotateXMinus,
    rotateXPlus,
    rotateYMinus,
    rotateYPlus,
    rotateZMinus,
    rotateZPlus,

    playRandomRotateSound,

    createElement,
    initWaterfall,

    initTweakPane,

    /**
     * Restrain element position
     *
     * @param   {Object}  element  Element
     *
     * @return  {Boolean}          Result
     */
    restrainElement(element) {
      if (!element) {
        return false;
      }

      const { pitWidth, pitHeight, pitDepth, xPoints, yPoints, size } = this;

      // element.updateMatrixWorld();

      const position = getWorldPosisition(element);

      // const sizeBefore = element.userData.size;

      const { x: sizeX, y: sizeY, z: sizeZ } = element.userData.size;

      // if (sizeBefore.x != sizeX) {
      //  this.log("Move to X point");
      //   element.translateX((sizeBefore.x - sizeX) / 2);
      // }

      // if (sizeBefore.y != sizeY) {
      //  this.log("Move to Y point");
      //   element.translateY((sizeBefore.y - sizeY) / 2);
      // }

      //this.log(
      //   element.userData.name,
      //   "position",
      //   {
      //     x: position.x.toFixed(1),
      //     y: position.y.toFixed(1),
      //     z: position.z.toFixed(1),
      //   },
      //   "size",
      //   {
      //     x: element.userData.size.x.toFixed(1),
      //     y: element.userData.size.y.toFixed(1),
      //     z: element.userData.size.z.toFixed(1),
      //   }
      // );

      const xPosition = Math.round((position.x - sizeX / 2) * 100) / 100;
      const yPosition = Math.round((position.y - sizeY / 2) * 100) / 100;

      if (!xPoints.includes(xPosition)) {
        //this.log("x before", xPosition);

        xPoints.forEach((point, index, array) => {
          if (xPosition > point && xPosition < array[index + 1]) {
            this.translateHelper(element, "x", point - xPosition);
          }
        });

        //this.log("x after", element.position.x);
      }

      if (!yPoints.includes(yPosition)) {
        //this.log("y before", yPosition);

        yPoints.forEach((point, index, array) => {
          if (yPosition > point && yPosition < array[index + 1]) {
            this.translateHelper(element, "y", point - yPosition);
          }
        });

        //this.log("y after", element.position.y);
      }

      // Restrain position
      if (position.x <= -pitWidth / 2 + sizeX / 2) {
        this.positionHelper(element, "x", -pitWidth / 2 + sizeX / 2);
      }

      if (position.x >= pitWidth / 2 - sizeX / 2) {
        this.positionHelper(element, "x", pitWidth / 2 - sizeX / 2);
      }

      if (position.y <= -pitHeight / 2 + sizeY / 2) {
        this.positionHelper(element, "y", -pitHeight / 2 + sizeY / 2);
      }

      if (position.y >= pitHeight / 2 - sizeY / 2) {
        this.positionHelper(element, "y", pitHeight / 2 - sizeY / 2);
      }

      if (position.z <= -pitDepth + sizeZ / 2 + size / 2) {
        this.positionHelper(element, "z", -pitDepth + sizeZ / 2 + size / 2);
      }

      if (position.z >= 1) {
        this.positionHelper(element, "z", 1);
      }

      // const newPosition = getWorldPosisition(element);

      // if (newPosition.x != position.x) {
      //   this.log(`X: ${position.x} -> ${newPosition.x}`);
      // }

      // if (newPosition.y != position.y) {
      //   this.log(`Y: ${position.y} -> ${newPosition.y}`);
      // }

      // if (newPosition.z != position.z) {
      //   this.log(`Z: ${position.z} -> ${newPosition.z}`);
      // }

      return element;
    },

    /**
     * Re-create pit helper
     *
     * @param   {String}   pitSize          Pit size string
     * @param   {Boolean}  [force=false]    Force re-create flag
     *
     * @return  {Boolean}                   Result
     */
    reCreatePit(pitSize, force = false) {
      if (!pitSize) {
        return true;
      }

      const {
        scene,
        size,
        gridColor,
        pitParts,
        halloweenParts,
        isHalloween,
        halloweenBlocksCount,
        isSimple,
        isInstanced,
        viewWidth,
        viewHeight,
        isPitGrid,
        gridFirstColor,
        gridSecondColor,
        skullLight,
      } = this;

      const [width, height, depth] = pitSize.split("x");

      if (!scene) {
        return false;
      }

      if ((!viewWidth || !viewHeight) && !force) {
        return false;
      }

      const vWidth = Math.round(viewWidth);
      const vHeight = Math.round(viewHeight);

      if (
        this.pit &&
        this.pit.userData.pitSize == pitSize &&
        this.pit.userData.viewWidth == vWidth &&
        this.pit.userData.viewHeight == vHeight &&
        !force
      ) {
        return false;
      }

      log(
        `Re-create pit call ${force}: ${pitSize}, ${vWidth} vw, ${vHeight} vh`
      );

      this.removeObjWithChildren(this.pit);
      this.pit = generatePit(
        width,
        height,
        depth,
        size,
        gridColor,
        pitParts,
        isSimple,
        isInstanced,
        Math.max(vWidth, vHeight),
        Math.max(vWidth, vHeight),
        isPitGrid,
        gridFirstColor,
        gridSecondColor,
        isHalloween ? halloweenParts : false,
        halloweenBlocksCount,
        skullLight
      );
      scene.add(this.pit);

      this.pit.userData.pitSize = pitSize;
      this.pit.userData.viewWidth = vWidth;
      this.pit.userData.viewHeight = vHeight;

      return true;
    },

    /**
     * Change pit size helper
     *
     * @param   {String}  pitSize  New pit size string
     *
     * @return  {Boolean}          Result
     */
    changePitSize(pitSize) {
      const { scene, renderer } = this;

      this.log(`Change pit size to ${pitSize}`);

      // remove all child
      scene.children
        .filter((item) => item.name.length)
        .forEach((child) => {
          this.removeObjWithChildren(child);
        });

      this.$store.commit("resetScore");
      this.$store.commit("setSpeed", this.settingsSpeed);

      this.showSpeed = this.speed;

      // reset elements array
      if (this.elements.length) {
        this.elements.forEach((item) => {
          this.removeObjWithChildren(item);
        });
      }

      for (const layer of this.layersElements) {
        for (const mesh of layer) {
          if (!mesh) {
            continue;
          }

          this.removeObjWithChildren(mesh);
        }
      }

      if (this.current) {
        this.removeObjWithChildren(this.current);
        this.current = undefined;
      }

      if (this.next) {
        this.removeObjWithChildren(this.next);
        this.next = undefined;
      }

      if (this.pit) {
        this.pit.traverse((obj) => {
          if (obj.isMesh && obj.dispose) {
            obj.dispose();
          }
        });
      }

      this.elements = [];

      renderer.renderLists.dispose();

      this.updateCameraProjection();
      this.reCreatePit(pitSize);

      // Init layers after resize
      this.initPoints();
      this.initLayers();
      this.initLights();
      // this.initLevelPreview();

      this.createElement();

      return true;
    },

    /**
     * Load zombie helper
     *
     * @return  {Boolean}  Result
     */
    async loadZombie() {
      const parts = await loadParts(this.progressCb);

      const halloweenParts = await loadHalloweenParts(this.progressCb);

      this.halloweenParts = halloweenParts.children;

      const pitParts = parts.children.filter((item) =>
        item.name.includes("G_")
      );
      const zombie = parts.children.filter((item) => item.name.includes("Z_"));

      const greyAtlas = await textureLoaderHelper(
        "T_GrayScaleAtlas16x16.png",
        "greyAtlas",
        this.progressCb
      );

      const greyBrains = await textureLoaderHelper(
        "T_GrayScaleBrains.png",
        "greyBrains",
        this.progressCb
      );

      const greyGuts = await textureLoaderHelper(
        "T_GrayScaleGuts.png",
        "greyGuts",
        this.progressCb
      );

      // Save atlases
      if (greyAtlas) {
        this.greyAtlas = greyAtlas;
      }

      if (greyBrains) {
        this.greyBrains = greyBrains;
      }

      if (greyGuts) {
        this.greyGuts = greyGuts;
      }

      // if (halloweenParts?.children?.length) {
      //   const head = halloweenParts.children.find((item) =>
      //     item.name.includes("Head")
      //   );

      //   const material = head.material.find((item) =>
      //     item.name.includes("Emissive")
      //   );

      //   const emissiveTween = new TWEEN.Tween({
      //     value: 0,
      //   });
      //   emissiveTween.easing(TWEEN.Easing.Quadratic.In);
      //   emissiveTween.repeatDelay(300);
      //   emissiveTween.repeat(Infinity);
      //   emissiveTween.yoyo(true);
      //   emissiveTween.to({ value: 1 }, 1500);
      //   emissiveTween.onUpdate(({ value }) => {
      //     material.emissiveIntensity = value;
      //   });

      //   emissiveTween.start();
      // }

      zombie.push(
        ...halloweenParts.children.filter(
          (item) =>
            (item.name.includes("H_01_") || item.name.includes("H_02_")) &&
            !item.name.includes("Candle") &&
            !item.name.includes("Skull")
        )
      );

      if (!zombie || !pitParts) {
        this.isSimple = true;
        return false;
      }

      for (const child of pitParts) {
        this.pitParts.push(child);

        if (Array.isArray(child.material)) {
          child.material.forEach((item) => {
            item.shininess = 0;
            item.specular = new Color(this.specularColor);
            item.flatShading = true;
          });
        } else {
          child.material.shininess = 0;
          child.material.specular = new Color(this.specularColor);
          child.material.flatShading = true;
        }
      }

      // Save all parts
      for (const child of zombie) {
        this.zombieParts.push(child);

        if (Array.isArray(child.material)) {
          child.material.forEach((item) => {
            item.shininess = 0;
            item.specular = new Color(this.specularColor);
            item.flatShading = true;
          });
        } else {
          child.material.shininess = 0;
          child.material.specular = new Color(this.specularColor);
          child.material.flatShading = true;
        }
      }

      return true;
    },

    /**
     * Update element preview helper
     *
     * @return  {Boolean}  Result
     */
    updatePreview() {
      //this.log("Update preview call");

      const { next, pitLevels, pitWidth, pitHeight, camera, size } = this;

      if (next) {
        if (camera.aspect > 1) {
          next.position.set(
            pitWidth / 2 + size,
            0,
            1.1 * next.userData.size.z + size
          );
        } else {
          next.position.set(
            0,
            -pitHeight / 2 - size / 2,
            1.1 * next.userData.size.z + size / 2
          );
        }
      }

      if (pitLevels) {
        if (camera.aspect > 1) {
          pitLevels.position.set(-pitWidth / 2 - size / 2, 0, 1.1 * 0.2 + size);
          pitLevels.rotation.set(0, 0, 0);
        } else {
          pitLevels.rotation.set(0, 0, MathUtils.degToRad(90));

          pitLevels.position.set(
            0,
            -pitHeight / 2 - size * 2,
            1.1 * 0.2 + size / 2
          );
        }
      }

      return true;
    },

    // initLevelPreview,
    isLayerVisible,
    // updateLayersPreview,

    initShaders,

    /**
     * Move element to corner helper
     *
     * @param   {Object}  element  Element
     *
     * @return  {Boolean}          Result
     */
    moveToRandomCorner(element) {
      const { pitWidth, pitHeight } = this;

      let cornerType = randomBetween(1, 5);

      while (cornerType == this.prevCorner) {
        cornerType = randomBetween(1, 5);
      }

      this.prevCorner = cornerType;

      const offset = randomBetween(-this.size, this.size);

      const left = -pitWidth / 2 - element.userData.size.x / 2;
      const right = element.userData.size.x / 2 + pitWidth / 2;

      const top = -element.userData.size.y / 2 + pitHeight / 2;
      const bottom = element.userData.size.y / 2 - pitHeight / 2;

      switch (cornerType) {
        // Top Left
        case 1:
          this.positionHelper(element, "x", left + offset);
          this.positionHelper(element, "y", top + offset);
          break;
        // Top Right
        case 2:
          this.positionHelper(element, "x", right + offset);
          this.positionHelper(element, "y", top + offset);
          break;
        // Bottom Left
        case 3:
          this.positionHelper(element, "x", left + offset);
          this.positionHelper(element, "y", bottom + offset);
          break;
        // Bottom Right
        case 4:
          this.positionHelper(element, "x", right + offset);
          this.positionHelper(element, "y", bottom + offset);
          break;
        default:
          break;
      }

      this.restrainElement(element);

      return element;
    },

    /**
     * Random shuffle elements
     *
     * @return  {Boolean}  Result
     */
    shuffle() {
      this.log("Shuffle call");

      const { layersElements, pitWidth, pitHeight } = this;

      const elements = layersElements.flat();

      if (!elements.length) {
        return false;
      }

      const zIndexes = elements
        .map((item) => item.userData.layer.z)
        .filter((item, index, array) => array.indexOf(item) === index);

      elements.forEach((element) => {
        let x = randomBetween(0, pitWidth - 1);
        let y = randomBetween(0, pitHeight - 1);
        const z = randomBetween(Math.min(...zIndexes), Math.max(...zIndexes));

        const elementLayer = element.userData.layer;

        this.setLayerPoint(
          elementLayer.x,
          elementLayer.y,
          elementLayer.z,
          0,
          false
        );

        let randomCounter = 0;
        while (this.layers[z][x][y] && randomCounter <= 20) {
          x = randomBetween(0, pitWidth - 1);
          y = randomBetween(0, pitHeight - 1);
          randomCounter++;
        }

        if (randomCounter >= 20) {
          this.setLayerPoint(
            elementLayer.x,
            elementLayer.y,
            elementLayer.z,
            1,
            false
          );
          return false;
        }

        // Remove from current layer
        this.layersElements[elementLayer.z] = this.layersElements[
          elementLayer.z
        ].filter((item) => item.uuid != element.uuid);

        // save layers params
        element.userData.layer.x = x;
        element.userData.layer.y = y;
        element.userData.layer.z = z;

        this.setLayerPoint(x, y, z, 1, false);

        element.position.set(
          this.xCPoints[x],
          this.yCPoints[y],
          this.zCPoints[z]
        );

        this.colorizeElement(element, z);

        // Add to new layer
        this.layersElements[z].push(element);
      });

      this.updateLayersView();

      return true;
    },

    /**
     * Shuffle layers call
     *
     * @return  {Boolean}  Result
     */
    shuffleLayers() {
      this.log("Shuffle layers call");

      const { layersElements } = this;

      const elements = layersElements.flat();

      if (!elements.length) {
        return false;
      }

      const zIndexes = elements
        .map((item) => item.userData.layer.z)
        .filter((item, index, array) => array.indexOf(item) === index);

      if (zIndexes.length <= 1) {
        return false;
      }

      let zIndexesAfter = zIndexes
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      while (JSON.stringify(zIndexes) == JSON.stringify(zIndexesAfter)) {
        zIndexesAfter = zIndexes
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
      }

      // Clear all layers
      elements.forEach((element) => {
        const elementLayer = element.userData.layer;
        this.setLayerPoint(
          elementLayer.x,
          elementLayer.y,
          elementLayer.z,
          0,
          false
        );
      });

      elements.forEach((element) => {
        const elementLayer = element.userData.layer;

        const indexBefore = zIndexes.indexOf(elementLayer.z);

        const newZ = zIndexesAfter[indexBefore];

        if (elementLayer.z == newZ) {
          this.setLayerPoint(
            elementLayer.x,
            elementLayer.y,
            elementLayer.z,
            1,
            false
          );

          return false;
        }

        this.setLayerPoint(
          elementLayer.x,
          elementLayer.y,
          elementLayer.z,
          0,
          false
        );

        // Remove from current layer
        this.layersElements[elementLayer.z] = this.layersElements[
          elementLayer.z
        ].filter((item) => item.uuid != element.uuid);

        element.userData.layer.z = newZ;

        this.setLayerPoint(elementLayer.x, elementLayer.y, newZ, 1, false);

        element.position.setZ(this.zCPoints[newZ]);

        this.layersElements[newZ].push(element);

        this.colorizeElement(element, newZ);
      });

      this.updateLayersView();

      return true;
    },

    getRandomForm,

    initLights,
    initPoints,

    /**
     * Init all
     *
     * @return  {Boolean}  Result
     */
    async init() {
      const { container } = this.$refs;

      const width = 800;
      const height = 600;

      const clock = new Clock();

      const camera = new PerspectiveCamera(this.fov, width / height, 0.01, 50);
      this.camera = camera;

      const scene = new Scene();
      scene.background = new Color(this.sceneColor);
      this.scene = scene;

      this.reCreatePit(this.pitSize);

      const fog = new FogExp2(this.fogColor, this.fogDensity);
      if (this.isFog) {
        scene.fog = fog;
      }
      this.fog = fog;

      // Init layers
      this.initPoints();
      this.initLayers();

      // Init light
      this.initLights();

      // Levels preview
      // this.initLevelPreview();

      // Init test mode
      // initTest.call(this);

      // init waterfall mode
      this.initWaterfall();

      // Audio
      this.initAudio();

      // this.createElement();

      this.initJoyPad();
      this.initKeyBoard();

      // animation

      let timeDelta = 0;

      const animation = () => {
        requestAnimationFrame(animation);

        // Save render info
        this.renderInfo = renderer.info;

        this.stats = {
          meshes: 0,
          instancedMeshes: 0,
          materials: 0,
          audio: 0,
          lights: 0,
          materials: {},
        };

        function traverse(obj, stats) {
          if (obj.type == "Scene") {
            return false;
          }

          if (obj.isInstancedMesh) {
            stats.instancedMeshes++;
            return true;
          }

          if (obj.isMesh) {
            stats.meshes++;

            if (Array.isArray(obj.material)) {
              obj.material.forEach((material) => {
                let name = material.name;
                const materialType = material.type;

                if (name == "") {
                  name = material.uuid;
                }

                if (!stats.materials[`${name}-${materialType}`]) {
                  stats.materials[`${name}-${materialType}`] = 0;
                }

                stats.materials[`${name}-${materialType}`]++;
              });
            } else {
              let name = obj.material.name;
              const materialType = obj.material.type;

              if (name == "") {
                name = obj.material.uuid;
              }

              if (!stats.materials[`${name}-${materialType}`]) {
                stats.materials[`${name}-${materialType}`] = 0;
              }

              stats.materials[`${name}-${materialType}`]++;
            }

            return true;
          }

          if (obj.type == "Audio") {
            stats.audio++;
            return true;
          }

          if (obj.isLight) {
            stats.lights++;
            return true;
          }
        }

        if (this.isDev) {
          this.scene.traverse((item) => traverse(item, this.stats));
          performance.mark("animation-start");
        }

        this.frames++;
        const time = Date.now();

        if (time >= this.prevTime + 1000) {
          this.fps = Math.round((this.frames * 1000) / (time - this.prevTime));
          this.frames = 0;
          this.prevTime = time;
        }

        const delta = clock.getDelta();

        if (this.isTimeless && this.timelessTime) {
          const newValue = this.timelessTime - delta * 1000;

          if (newValue <= 0) {
            this.endGameCall(false);
          }

          this.$store.commit("setTimelessTime", newValue);
        } else {
          this.$store.commit("setTimelessTime", this.timelessMaxTime);
        }

        if (!this.isPause) {
          const divider =
            this.isSlow && this.slowDivider
              ? 5 + (5 * this.slowDivider) / 100
              : 1;

          timeDelta += delta / divider;
        }

        const second = Math.round(timeDelta) * this.speed;

        this.delta = delta;
        this.timeDelta = timeDelta;
        this.second = second;

        if (Array.isArray(this.loopCb) && this.loopCb.length && !this.isPause) {
          this.loopCb.forEach((fn) => fn(delta, timeDelta, second));
        }

        if (this.next) {
          this.next.rotation.x = timeDelta / 1;
          this.next.rotation.y = timeDelta / 2;
          this.next.rotation.z = timeDelta / 3;
        }

        if (this.isSlow) {
          this.slowValue -= delta;

          if (this.slowValue <= 0) {
            this.slowValue = 0;
            this.isSlow = false;
          }
        } else {
          this.slowValue += delta;

          if (this.slowValue >= 3) {
            this.slowValue = 3;
          }
        }

        // controls.update();

        if (this.isShaders) {
          composer.render();
        } else {
          renderer.render(scene, camera);
        }

        TWEEN.update();

        if (!this.isDev) {
          return true;
        }

        performance.mark("animation-end");
        const measure = performance.measure(
          "animation",
          "animation-start",
          "animation-end"
        );

        this.frameTime = measure.duration;

        performance.clearMarks();
        performance.clearMeasures();

        return true;
      };

      const renderer = new WebGLRenderer({
        antialias: this.antialias,
        powerPreference: "high-performance",
        stencil: false,
        alpha: false,
        // depth: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(this.pixelRatio);
      renderer.sortObjects = false;
      // renderer.setAnimationLoop(animation);
      renderer.gammaFactor = 2.2;
      container.appendChild(renderer.domElement);
      this.renderer = renderer;

      const composer = this.initShaders(width, height, renderer, scene, camera);
      this.composer = composer;

      if (this.orbitControls) {
        const { OrbitControls } = await import(
          "three/addons/controls/OrbitControls.js"
        );

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.maxZoom = 10;
        controls.maxDistance = 50;
        this.controls = controls;
      }

      this.updateRendererSize();

      // Add test points
      // for (let i = 0; i > -this.pitDepth; i--) {
      //   const onePoint = generateP0Form(this.size, false, true);
      //   onePoint.position.set(-10, -10, i);
      //   this.restrainElement(onePoint);
      //   this.scene.add(onePoint);

      //   if (this.layersElements[i]) {
      //     this.layersElements[i].push(onePoint);
      //   }
      // }

      animation();

      return true;
    },

    initJoyPad,
    initKeyBoard,

    /**
     * Parse and set params by URL search
     *
     * @return  {Boolean}  Result
     */
    parseURLSearchParams() {
      this.log("Parse URLSearchParams");

      const params = new URLSearchParams(window.location.search);

      for (let [id, value] of params.entries()) {
        if (value == "true") {
          value = true;
        }

        if (value == "false") {
          value = false;
        }

        if (id in this.$data) {
          this.log(`Update ${id}`, value);

          this.$data[id] = value;
        }
      }

      if (params.has("orbit") && params.get("orbit") == "true") {
        this.orbitControls = true;
      }

      if (params.has("helpers") && params.get("helpers") == "true") {
        this.helpers = true;
      }

      return true;
    },

    /**
     * Progress download callback helper
     *
     * @param   {String}  name     Download filename
     * @param   {Number}  total    Total downloaded number
     * @param   {Number}  loaded   Downloaded number
     * @param   {Number}  percent  Percent
     *
     * @return  {Boolean}          Update result
     */
    progressCb({ name, total, loaded, percent }) {
      this.loadingProcessCache[name] = { total, loaded, percent };

      this.log(`Loaded ${name}: ${this.loadPercent.toFixed(2)}`);

      this.$store.commit("reportETA", this.loadPercent);

      if (this.loadPercent >= 1) {
        this.isLoading = false;
      }

      return true;
    },

    playBgSound() {
      //this.log("Play bg sound: ", this.isWindowFocus);
      if (this.bgSound && !this.bgSound.isPlaying && this.isWindowFocus) {
        this.bgSound.play();
      }
    },

    pauseBgSound() {
      //this.log("Pause bg sound: ", this.isWindowFocus);
      if (this.bgSound?.isPlaying) {
        this.bgSound.pause();
      }
    },

    playMenuBgSound() {
      //this.log("Play bg menu sound: ", this.isWindowFocus);
      if (
        this.bgMenuSound &&
        !this.bgMenuSound.isPlaying &&
        this.isWindowFocus
      ) {
        this.bgMenuSound.play();
      }
    },

    pauseMenuBgSound() {
      //this.log("Pause bg menu sound: ", this.isWindowFocus);
      if (this.bgMenuSound?.isPlaying) {
        this.bgMenuSound.pause();
      }
    },

    playMusic() {
      this.log("Play music: ", this.isWindowFocus);

      this.isWindowFocus = true;

      this.openMenuScreen();
    },

    pauseMusic() {
      this.log("Pause music");

      this.isWindowFocus = false;

      this.isPause = true;
      this.isMenu = true;

      this.pauseBgSound();
      this.pauseMenuBgSound();
    },

    /**
     * Open menu screen helper
     *
     * @return  {Boolean}  Result
     */
    openMenuScreen() {
      this.log("Opened menu screen: ", this.isWindowFocus);

      if (!this.isWindowFocus || !this.bgSound || !this.bgMenuSound) {
        return false;
      }

      const fadeOutTween = new TWEEN.Tween({
        volume: this.bgMenuSound.getVolume(),
      });
      fadeOutTween.to({ volume: this.volume }, 700);
      fadeOutTween.onUpdate(({ volume }) => {
        if (this.bgMenuSound) {
          this.bgMenuSound.setVolume(volume);
        }

        this.playMenuBgSound();
      });

      const fadeInTween = new TWEEN.Tween({ volume: this.bgSound.getVolume() });
      fadeInTween.to({ volume: 0 }, 700);
      fadeInTween.onUpdate(({ volume }) => {
        if (volume == 0) {
          this.pauseBgSound();
        }

        if (this.bgSound) {
          this.bgSound.setVolume(volume);
        }
      });

      fadeInTween.start();
      fadeOutTween.start();

      return true;
    },

    /**
     * Close menu screen helper
     *
     * @return  {Boolean}  Result
     */
    closeMenuScreen() {
      if (!this.isWindowFocus || !this.bgSound || !this.bgMenuSound) {
        return false;
      }

      this.log("Closed menu screen: ", this.isWindowFocus);

      this.isFirstTime = true;

      const fadeOutTween = new TWEEN.Tween({
        volume: this.bgSound.getVolume(),
      });
      fadeOutTween.to({ volume: this.volume }, 700);
      fadeOutTween.onUpdate(({ volume }) => {
        if (this.bgSound) {
          this.bgSound.setVolume(volume);
        }

        this.playBgSound();
      });

      const fadeInTween = new TWEEN.Tween({
        volume: this.bgMenuSound.getVolume(),
      });
      fadeInTween.to({ volume: 0 }, 700);
      fadeInTween.onUpdate(({ volume }) => {
        if (volume == 0) {
          this.pauseMenuBgSound();
        }

        if (this.bgMenuSound) {
          this.bgMenuSound.setVolume(volume);
        }
      });

      fadeInTween.start();
      fadeOutTween.start();

      return true;
    },

    /**
     * Open controls screen helper
     *
     * @param   {Boolean}  [flag=true]        Open flag
     * @param   {Boolean}  [closeMenu=false]  Close menu flag
     *
     * @return  {Boolean}                     Result
     */
    openControlsInfo(flag = true, closeMenu = false) {
      this.log("Open controls info screen");
      this.isControlsInfo = flag;

      if (closeMenu) {
        this.closeMenu();
      }

      return true;
    },

    closeControlsInfo() {
      this.log("Close controls info");
      this.isControlsInfo = false;

      if (!this.isControlsInfoShowed && !this.isMenu) {
        this.isControlsInfoShowed = true;
        this.newGameCall(this.isPractice);
      }

      this.isControlsInfoShowed = true;
      return true;
    },

    /**
     * Vibrate call helper
     *
     * @param   {Number}  [time=500]  Vibrate time
     *
     * @return  {Boolean}             Result
     */
    vibrateCall(time = 500) {
      if (!this.isVibration || !navigator.vibrate) {
        return false;
      }

      this.log("Vibrate call");

      if (navigator.vibrate) {
        navigator.vibrate(time);
      }

      if (this.gamepad && window.joypad) {
        window.joypad.vibrate(this.gamepad, {
          startDelay: 0,
          duration: time,
          weakMagnitude: 0.2,
          strongMagnitude: 1,
        });
      }

      return true;
    },

    /**
     * Controls call helper
     *
     * @param   {String}  callId  Function ID
     *
     * @return  {Boolean}         Result
     */
    controlsCallHelper(callId) {
      if (this.isMenu) {
        return false;
      }

      this.movesCounter += 1;

      if (this[callId]) {
        this[callId]();
      }

      return true;
    },

    /**
     * Add random forms helper
     *
     * @return  {Boolean}  Result
     */
    addRandomFigures() {
      const { randomFormsCount } = this;

      this.log("Add random forms: ", randomFormsCount);

      for (let i = 0; i < randomFormsCount; i++) {
        const element = this.getRandomForm();

        for (let i = 0; i < 5; i++) {
          const rotateNumber = randomBetween(0, 5);

          switch (rotateNumber) {
            case 0:
              this.rotateHelper(element, "x", -90);
              break;
            case 1:
              this.rotateHelper(element, "x", 90);
              break;
            case 2:
              this.rotateHelper(element, "y", -90);
              break;
            case 3:
              this.rotateHelper(element, "y", 90);
              break;
            case 4:
              this.rotateHelper(element, "z", -90);
              break;
            case 5:
              this.rotateHelper(element, "z", 90);
              break;
          }
        }

        // Add to global cache
        this.elements.push(element);

        // Move to random corner
        this.moveToRandomCorner(element);

        this.dropElement(element);
        element.userData.drop = false;
        this.petrify(element, false);
      }

      this.updateLayersView();

      return true;
    },

    /**
     * Rotate pit
     *
     * @return  {Boolean}  Result
     */
    rotatePit() {
      let elements = this.layersElements.flat();

      if (!elements.length) {
        return false;
      }

      this.log("Rotate pit call");

      this.$store.commit("rotatePit");

      this.pit.rotation.set(0, 0, this.pit.rotation.z + MathUtils.degToRad(90));

      this.updateCameraProjection();

      // Init layers after resize
      this.initLayers();
      this.initPoints();

      const pivotGroup = new Group();
      pivotGroup.add(...elements);

      pivotGroup.rotation.set(
        0,
        0,
        pivotGroup.rotation.z + MathUtils.degToRad(-90)
      );

      elements = pivotGroup.children.map((item) => {
        const newPosition = getWorldPosisition(item, true);

        const newItem = item.clone();
        newItem.position.copy(newPosition);

        this.scene.add(newItem);

        return newItem;
      });

      elements.forEach((el) => {
        const { x, y, z } = this.getElementLayerPointsForItem(el);

        el.userData.layer = { x, y, z };
        this.layersElements[z].push(el);
      });

      this.restrainElement(this.current);

      return true;
    },

    /**
     * Dispose object helper
     *
     * @param   {Object}  obj  Input mesh or smth
     *
     * @return  {Boolean}      Result
     */
    removeObjWithChildren(obj) {
      if (!obj) {
        return false;
      }

      // Process childs
      if (obj?.children.length > 0) {
        for (let x = obj.children.length - 1; x >= 0; x--) {
          this.removeObjWithChildren(obj.children[x]);
        }
      }

      // Dispose materials and geometry
      if (obj.isMesh) {
        obj.geometry.dispose();

        if (Array.isArray(obj.material)) {
          obj.material.forEach((material) => material.dispose());
        } else {
          obj.material.dispose();
        }
      }

      // Remove from parent
      if (obj.parent) {
        obj.parent.remove(obj);
      }

      if (this.renderer) {
        this.renderer.renderLists.dispose();
      }

      return true;
    },
  },

  watch: {
    pixelRatio(newValue) {
      const { renderer } = this;

      if (renderer) {
        renderer.setPixelRatio(newValue);
      }
    },

    endGameCounter(newValue) {
      if (newValue >= 13) {
        this.emitter.emit("addAchievement", "still-playing");
      }
    },

    rotateCount(newValue) {
      if (newValue >= 83) {
        this.emitter.emit("addAchievement", "keep-rolling");
      }
    },

    speed(newValue, oldValue) {
      if (newValue == this.maxSpeed) {
        this.emitter.emit("addAchievement", "fast-and-furious");
      }

      if (this.showSpeedTween) {
        this.showSpeedTween.stop();
      }

      this.showSpeedTween = new TWEEN.Tween({
        value: oldValue,
      });
      this.showSpeedTween.easing(TWEEN.Easing.Quadratic.In);
      this.showSpeedTween.to({ value: newValue }, 300 / this.speed);
      this.showSpeedTween.onUpdate(({ value }) => {
        this.showSpeed = roundValue(value, 2);
      });

      this.showSpeedTween.start();
    },

    score(newValue, oldValue) {
      if (newValue >= 300) {
        this.emitter.emit("addAchievement", "proud-of-you");
      }

      if (this.scoreTimeout) {
        this.scoreIncrement = 0;
        clearTimeout(this.scoreTimeout);
      }

      this.scoreTimeout = setTimeout(() => {
        this.scoreIncrement = 0;
        this.scoreTimeout = undefined;
      }, 350);

      this.scoreIncrement = newValue - oldValue;

      this.updatePlaybackRate();

      if (this.showScoreTween) {
        this.showScoreTween.stop();
      }

      this.showScoreTween = new TWEEN.Tween({
        value: oldValue,
      });
      this.showScoreTween.easing(TWEEN.Easing.Quadratic.In);
      this.showScoreTween.to({ value: newValue }, 300 / this.speed);
      this.showScoreTween.onUpdate(({ value }) => {
        this.showScore = Math.round(value);
      });

      this.showScoreTween.start();

      // if (newValue > this.maxScore) {
      //   if (this.showBestScoreTween) {
      //     this.showBestScoreTween.stop();
      //   }

      //   this.showBestScoreTween = new TWEEN.Tween({
      //     value: this.showBestScore,
      //   });
      //   this.showBestScoreTween.easing(TWEEN.Easing.Quadratic.In);
      //   this.showBestScoreTween.to({ value: newValue }, 700 / this.speed);
      //   this.showBestScoreTween.onUpdate(({ value }) => {
      //     this.showBestScore = Math.round(value);
      //   });

      //   this.showBestScoreTween.start();
      // }
    },

    isRotateRestrain() {
      this.rotateCount = 0;
    },

    isLogo(newValue) {
      if (newValue) {
        this.openMenuScreen();
      }
    },

    volume(newValue) {
      this.updateVolume(newValue);
    },

    fxVolume(newValue) {
      this.updateFxVolume(newValue);
    },

    pitSize(newValue) {
      this.changePitSize(newValue);
    },

    colorPaletteType(newValue) {
      this.log("Update color palette type: ", newValue);

      this.isOldColorize = newValue == "complex" ? false : true;
    },

    blocksType(newValue) {
      this.updateBlocksType(newValue);
    },

    isControls() {
      this.updateControls();
    },

    isLevelHelpers(newValue) {
      if (newValue) {
        this.initLayerHelpers();
      } else {
        // Delete helpers for layer
        for (const id in this.layersHelpers) {
          this.removeObjWithChildren(this.layersHelpers[id]);
        }
      }

      this.updateLayersView();
    },

    isPitGrid() {
      this.reCreatePit(this.pitSize, true);
    },

    isSlow(newValue) {
      if (this.slowValueTween) {
        this.slowValueTween.stop();
      }

      this.slowValueTween = new TWEEN.Tween({
        value: newValue ? 0 : 100,
      });
      this.slowValueTween.easing(TWEEN.Easing.Quadratic.In);
      this.slowValueTween.to({ value: newValue ? 100 : 0 }, 300);
      this.slowValueTween.onUpdate(({ value }) => {
        this.slowDivider = value;
      });

      this.slowValueTween.start();
    },

    isTest() {
      this.log("Load test mode");

      this.isPause = false;
      this.isMenu = false;

      this.isAccepted = true;
      this.isLogo = false;
      this.isControlsInfo = false;
      this.isControlsInfoShowed = true;
      this.isLoading = false;
      this.isFirstTime = true;

      this.closeMenu();
    },

    isEndless(newValue) {
      this.log("Update endless mode: ", newValue);
    },

    isPractice(newValue) {
      this.log("Update practice mode: ", newValue);
    },

    isFog(newValue) {
      this.scene.fog = newValue ? this.fog : undefined;
    },

    fogColor(newValue) {
      this.fog.color = newValue;
    },

    fogDensity(newValue) {
      this.fog.density = newValue;
    },
  },

  beforeMount() {
    this.parseURLSearchParams();
  },

  async mounted() {
    if (this.$store.getters.isAccepted) {
      this.acceptedCall();
    }

    this.showSpeed = this.speed;
    this.showBestScore = this.maxScore;

    await this.loadZombie();
    this.initAudio();
    this.init();

    window.addEventListener("resize", this.updateRendererSize);
    window.addEventListener("orientationchange", this.updateRendererSize);
    window.addEventListener("focus", this.playMusic);
    window.addEventListener("blur", this.pauseMusic);

    this.emitter.on("openMenuScreen", this.openMenuScreen);
    this.emitter.on("closeMenuScreen", this.closeMenuScreen);

    this.emitter.on("how-to-play", this.openControlsInfo);
    this.emitter.on("newGame", this.newGame);

    this.emitter.on("vibrate", this.vibrateCall);
  },

  unmounted() {
    window.removeEventListener("resize", this.updateRendererSize);
    window.removeEventListener("orientationchange", this.updateRendererSize);
    window.removeEventListener("focus", this.playMusic);
    window.removeEventListener("blur", this.pauseMusic);

    this.emitter.off("openMenuScreen", this.openMenuScreen);
    this.emitter.off("closeMenuScreen", this.closeMenuScreen);

    this.emitter.off("how-to-play", this.openControlsInfo);
    this.emitter.off("newGame", this.newGame);

    this.emitter.off("vibrate", this.vibrateCall);
  },
};
