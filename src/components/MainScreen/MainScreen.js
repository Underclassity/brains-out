import { mapState, mapGetters } from "vuex";

import {
  Clock,
  Color,
  MeshBasicMaterial,
  MathUtils,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import * as TWEEN from "@tweenjs/tween.js";

import "joypad.js";

import { loadParts, loadHalloweenParts } from "../../helpers/load-zombie.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import getGroupSize from "../../helpers/get-group-size.js";
import getWorldPosisition from "../../helpers/get-world-position.js";
import generatePit from "../../helpers/generate-pit.js";
import log from "../../helpers/log.js";
import randomBetween from "../../helpers/random-between.js";
import roundValue from "../../helpers/round-value.js";
import throttle from "../../helpers/throttle.js";

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
  getLayerColor,
  isLayerVisible,
} from "./init-pit-levels.js";
import { initLights } from "./init-lights.js";
import {
  initLayer,
  initLayers,
  setLayerPoint,
  updateLayersView,
} from "./init-layers.js";
import { initWaterfall, createElement } from "./waterfall.js";
import { initTweakPane } from "./init-tweakpane.js";
import initShaders from "./init-shaders.js";
import colorPalette from "./color-palette.js";
import getRandomForm from "./get-random-form.js";
import initPoints from "./init-points.js";
// import initTest from "./init-test.js";

// import MenuComponent from "../MenuComponent/MenuComponent.vue";
import AcceptBugsScreen from "../AcceptBugsScreen/AcceptBugsScreen.vue";
import LoadingScreen from "../LoadingScreen/LoadingScreen.vue";
import LogoScreen from "../LogoScreen/LogoScreen.vue";
import MenuScreen from "../MenuScreen/MenuScreen.vue";
// import generateP0Form from "../../helpers/blocks/p0.js";

import ControlsBlock from "../ControlsBlock/ControlsBlock.vue";
import ControlsInfoScreen from "../ControlsInfoScreen/ControlsInfoScreen.vue";

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
      colorPalette,

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
      isPitGrid: false,
      isTest: false,

      changeSpeedByLevels: true,

      isMobile: false,

      viewWidth: undefined,
      viewHeight: undefined,

      isAccepted: false,
      isLogo: false,
      isControlsInfo: false,
      isControlsInfoShowed: false,

      isLoading: true,
      loadingProcessCache: {},

      isRandomColor: false,
      isColorizeLevel: true,
      isOldColorize: false,
      isRotateAnimation: false,
      isRotating: false,

      randomFormsCount: 5,

      // Modes
      isEndless: false,
      isPractice: false,

      isSlow: false,
      slowValue: 100,
      slowDivider: 0,

      // Helpers
      orbitControls: false,
      helpers: false,

      isKeyPressed: false,

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
      controls: undefined,
      pit: undefined,
      gamepad: undefined,

      isShaders: true,
      composer: undefined,

      // isDotScreenPass: false,
      // isFilmPass: false,
      // isGlitch: false,
      // isSAOPass: false,
      // isSSAOPass: false,
      // isSSRPass: false,
      // isTechnicolor: false,
      // isUnrealBloomPass: false,

      // dotScreenPass: undefined,
      // filmPass: undefined,
      // glitchPass: undefined,
      // SAOComposerPass: undefined,
      // SSAOComposerPass: undefined,
      // SSRComposerPass: undefined,
      // technicolorShaderPass: undefined,
      // UnrealBloomComposerPass: undefined,

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

      fps: 0,
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
    // MenuComponent,
    AcceptBugsScreen,
    ControlsBlock,
    ControlsInfoScreen,
    LoadingScreen,
    LogoScreen,
    MenuScreen,
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

      "fov",
      "pixelRatio",
      "antialias",
      "lightPower",

      "minSpeed",
      "speed",
      "settingsSpeed",
      "maxSpeed",
      "speedStep",

      "score",
      "lsScore",
      "endGameCounter",

      "isDev",
      "isControls",
      "isVibration",

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
    ]),

    ...mapGetters(["maxScore", "minScore", "avgScore"]),

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
    updateRendererSize() {
      this.isMobile =
        window.innerWidth / window.innerHeight < 1 && window.innerWidth < 1024;

      this.$nextTick(function () {
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
      });

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
     * @return  {Boolean}  Result
     */
    newGameCall() {
      if (!this.isControlsInfoShowed) {
        this.openControlsInfo(true, true);
        return true;
      }

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

      const { scene } = this;

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
          if (item.dispose) {
            item.dispose();
          }
          scene.remove(item);
        });
      }

      for (const layer of this.layersElements) {
        for (const mesh of layer) {
          if (!mesh) {
            continue;
          }

          if (mesh.dispose) {
            mesh.dispose();
          }
          scene.remove(mesh);
        }
      }

      if (this.current) {
        scene.remove(this.current);
        this.current = undefined;
      }

      if (this.next) {
        scene.remove(this.next);
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
          el: child.clone(),
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

      // if (xIndex == -1 || yIndex == -1 || zIndex == -1) {
      //   debugger;
      // }

      return {
        x: xIndex,
        y: yIndex,
        z: zIndex,
        pX: x,
        pY: y,
        pZ: z,
        uuid: child.uuid,
        el: child.clone(),
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

      for (const { x, y, z, pX, pY, pZ, uuid, el } of indexes) {
        for (let zIndex = 0; zIndex < this.zPoints.length; zIndex++) {
          if (this.layers[zIndex + 1] && this.layers[zIndex + 1][x][y]) {
            collisionPoints.push({ x, y, z, pX, pY, pZ, zIndex, uuid, el });
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
      this.log(`Drop element: ${element.name}`);

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
      } else {
        this.translateHelper(
          element,
          "z",
          this.zCPoints[this.zCPoints.length - 1]
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

    /**
     * Colorize element
     *
     * @param   {Object}  element  Element
     * @param   {Number}  layer    Layer index
     *
     * @return  {Boolean}          Result
     */
    colorizeElement(element, layer) {
      if (!this.isColorizeLevel) {
        return false;
      }

      const color = this.colorPalette[layer];

      this.log(
        `Colorize element ${
          element.name
        } on layer ${layer}: ${color.getHexString()}`,
        `color: #${color.getHexString()}`
      );

      element.traverse((obj) => {
        if (!obj.isMesh) {
          return false;
        }

        if (Array.isArray(obj.material)) {
          obj.material.forEach((material, index, array) => {
            if (this.isOldColorize) {
              array[index] = new MeshBasicMaterial({ color });
            } else {
              array[index].color.set(color);
              array[index].needsUpdate = true;
            }
          });

          return false;
        }

        if (this.isOldColorize) {
          obj.material = new MeshBasicMaterial({ color });
        } else {
          obj.material.color.set(color);
          obj.material.needsUpdate = true;
        }
      });

      return true;
    },

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
        this.scene.remove(element);
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
      const elementPoints = this.getElementLayerPoints(element);

      this.log(`End game call on element: ${element.name}`);

      this.changeScore(elementPoints.length, "points");

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

      this.scene.remove(element);

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
        if (this.layers[z][x][y]) {
          this.endGameCall(element);
          return false;
        }

        const el = element.getObjectByProperty("uuid", uuid);

        const itemPosition = getWorldPosisition(el);

        this.positionHelper(el, "x", itemPosition.x);
        this.positionHelper(el, "y", itemPosition.y);
        this.positionHelper(el, "z", itemPosition.z);

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

      //       this.scene.remove(element);

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
      this.scene.remove(element);

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

      if (position.z >= 0) {
        this.positionHelper(element, "z", 0);
      }

      // const newPosition = new Vector3();
      // element.getWorldPosition(position);

      // if (newPosition.x != position.x) {
      //  this.log(`X: ${position.x} -> ${newPosition.x}`);
      // }

      // if (newPosition.y != position.y) {
      //  this.log(`Y: ${position.y} -> ${newPosition.y}`);
      // }

      // if (newPosition.z != position.z) {
      //  this.log(`Z: ${position.z} -> ${newPosition.z}`);
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
        candleParts,
        isSimple,
        isInstanced,
        viewWidth,
        viewHeight,
        isPitGrid,
        gridFirstColor,
        gridSecondColor,
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

      scene.remove(this.pit);
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
        candleParts
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
          if (child.dispose) {
            child.dispose();
          }

          scene.remove(child);
        });

      this.$store.commit("resetScore");
      this.$store.commit("setSpeed", this.settingsSpeed);

      this.showSpeed = this.speed;

      // reset elements array
      if (this.elements.length) {
        this.elements.forEach((item) => {
          if (item.dispose) {
            item.dispose();
          }

          scene.remove(item);
        });
      }

      for (const layer of this.layersElements) {
        for (const mesh of layer) {
          if (!mesh) {
            continue;
          }

          if (mesh.dispose) {
            mesh.dispose();
          }
          scene.remove(mesh);
        }
      }

      if (this.current) {
        scene.remove(this.current);
        this.current = undefined;
      }

      if (this.next) {
        scene.remove(this.next);
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

      // const candleParts = halloweenParts.children.filter(
      //   (item) => item.name.includes("SM") && item.name.includes("Candle")
      // );

      // this.candleParts = candleParts;

      const pitParts = parts.children.filter((item) =>
        item.name.includes("G_")
      );
      const zombie = parts.children.filter((item) => item.name.includes("Z_"));

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
        ...halloweenParts.children.filter((item) => item.name.includes("Head"))
      );

      if (!zombie || !pitParts) {
        this.isSimple = true;
        return false;
      }

      for (const child of pitParts) {
        this.pitParts.push(child);

        if (Array.isArray(child.material)) {
          child.material.forEach((item, index, array) => {
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
          child.material.forEach((item, index, array) => {
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
    getLayerColor,
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
    init() {
      const { container } = this.$refs;

      const width = 800;
      const height = 600;

      const clock = new Clock();

      const camera = new PerspectiveCamera(this.fov, width / height, 0.01, 100);
      this.camera = camera;

      const scene = new Scene();
      scene.background = new Color(this.sceneColor);
      this.scene = scene;

      this.reCreatePit(this.pitSize);

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

      this.createElement();

      this.initJoyPad();

      // animation

      let timeDelta = 0;

      const animation = () => {
        requestAnimationFrame(animation);

        this.frames++;
        const time = Date.now();

        if (time >= this.prevTime + 1000) {
          this.fps = Math.round((this.frames * 1000) / (time - this.prevTime));
          this.frames = 0;
          this.prevTime = time;
        }

        const delta = clock.getDelta();

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
          // this.scene.traverse((item) => {
          //   try {
          //     console.log(item.modelViewMatrix);
          //   } catch (error) {
          //     console.log(error);
          //     debugger;
          //   }
          // });

          composer.render();
        } else {
          renderer.render(scene, camera);
        }

        TWEEN.update();
      };

      const renderer = new WebGLRenderer({
        antialias: this.antialias,
        powerPreference: "high-performance",
        stencil: false,
        // depth: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(this.pixelRatio);
      // renderer.setAnimationLoop(animation);
      renderer.gammaFactor = 2.2;
      container.appendChild(renderer.domElement);
      this.renderer = renderer;

      const composer = this.initShaders(width, height, renderer, scene, camera);
      this.composer = composer;

      if (this.orbitControls) {
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

    initJoyPad() {
      if (!window.joypad) {
        return false;
      }

      const { joypad } = window;

      joypad.set({
        axisMovementThreshold: 0.95,
      });

      joypad.on("connect", (e) => {
        const { id } = e.gamepad;

        this.log(`${id} connected!`);

        this.gamepad = e.gamepad;

        this.$store.commit("enableGamepad");
        this.emitter.emit("enableGamepad");
      });

      joypad.on("disconnect", (e) => {
        this.gamepad = undefined;
        this.$store.commit("disableGamepad");
        this.emitter.emit("disableGamepad");
      });

      joypad.on("button_press", (e) => {
        const inMenu = this.isMenu || !this.isAccepted;

        this.log(`Press ${e.detail.buttonName}: menu ${inMenu}`);

        this.movesCounter += 1;

        switch (e.detail.buttonName) {
          // Left
          case "button_14":
            if (inMenu) {
              this.emitter.emit("pressLeft");
            } else {
              this.moveLeft();
            }
            break;
          // Right
          case "button_15":
            if (inMenu) {
              this.emitter.emit("pressRight");
            } else {
              this.moveRight();
            }
            break;
          // Up
          case "button_12":
            if (inMenu) {
              this.emitter.emit("pressUp");
            } else {
              this.moveUp();
            }
            break;
          // Down
          case "button_13":
            if (inMenu) {
              this.emitter.emit("pressDown");
            } else {
              this.moveDown();
            }
            break;
          // A
          case "button_0":
            if (inMenu) {
              this.emitter.emit("pressA");
            } else {
              this.current.userData.drop = true;
            }
            break;
          // B
          case "button_1":
            if (inMenu) {
              this.emitter.emit("pressB");
            }
            break;
          // Y
          case "button_2":
            if (inMenu) {
              this.emitter.emit("pressY");
            }
            break;
          // X
          case "button_3":
            if (inMenu) {
              this.emitter.emit("pressX");
            }
            break;
          //LB
          case "button_4":
            if (inMenu) {
              this.emitter.emit("pressLB");
            } else {
              this.rotateZPlus();
            }
            break;
          // RB
          case "button_5":
            if (inMenu) {
              this.emitter.emit("pressRB");
            } else {
              this.rotateZMinus();
            }
            break;
          // LT
          case "button_6":
            if (inMenu) {
              this.emitter.emit("pressLT");
            }
            break;
          // RT
          case "button_7":
            if (inMenu) {
              this.emitter.emit("pressRT");
            } else {
              this.current.userData.drop = true;
            }
            break;
          // Select
          case "button_8":
            break;
          // Pause
          case "button_9":
            if (!this.isFirstTime) {
              return false;
            }

            if (!inMenu) {
              this.openMenu();
            }
            break;
          // Left Trigger
          case "button_10":
            break;
          // Right Trigger
          case "button_11":
            break;
          // Xbox button
          case "button_16":
            break;
        }
      });

      const throttledMovement = throttle((stickMoved, directionOfMovement) => {
        if (stickMoved == "right_stick") {
          switch (directionOfMovement) {
            case "top":
              if (this.isMenu) {
                return false;
              } else {
                this.rotateXMinus();
              }
              break;
            case "bottom":
              if (this.isMenu) {
                return false;
              } else {
                this.rotateXPlus();
              }
              break;
            case "left":
              if (this.isMenu) {
                return false;
              } else {
                this.rotateYMinus();
              }
              break;
            case "right":
              if (this.isMenu) {
                return false;
              } else {
                this.rotateYPlus();
              }
              break;
          }
        } else {
          switch (directionOfMovement) {
            case "top":
              if (this.isMenu) {
                return false;
              } else {
                this.moveUp();
              }
              break;
            case "bottom":
              if (this.isMenu) {
                return false;
              } else {
                this.moveDown();
              }
              break;
            case "left":
              if (this.isMenu) {
                return false;
              } else {
                this.moveLeft();
              }
              break;
            case "right":
              if (this.isMenu) {
                return false;
              } else {
                this.moveRight();
              }
              break;
          }
        }
      }, 150);

      joypad.on("axis_move", (e) => {
        const { stickMoved, directionOfMovement } = e.detail;

        throttledMovement(stickMoved, directionOfMovement);
      });

      return false;
    },

    keyUpHandler() {
      this.isKeyPressed = false;
    },

    keyHandler({ code }) {
      if (this.isKeyPressed) {
        return false;
      }

      this.isKeyPressed = true;

      this.movesCounter += 1;

      switch (code) {
        case "KeyQ":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press Q");
            this.rotateZPlus();
          }
          break;
        case "KeyE":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press E");
            this.rotateZMinus();
          }
          break;
        case "KeyW":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press W");
            this.rotateXMinus();
          }
          break;
        case "KeyS":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press S");
            this.rotateXPlus();
          }
          break;
        case "KeyA":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press A");
            this.rotateYMinus();
          }
          break;
        case "KeyD":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press D");
            this.rotateYPlus();
          }
          break;
        case "ArrowUp":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press Up");
            this.moveUp();
          }
          break;
        case "ArrowDown":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press Down");
            this.moveDown();
          }
          break;
        case "ArrowLeft":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press Left");
            this.moveLeft();
          }
          break;
        case "ArrowRight":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press Right");
            this.moveRight();
          }
          break;
        case "ShiftLeft":
          this.isSlow = !this.isSlow;
          break;
        case "Space":
          if (this.isMenu) {
            return false;
          } else {
            //this.log("Press Space");
            // this.isPause = !this.isPause;
            this.current.userData.drop = true;
          }

          break;
        case "Escape":
          //this.log("Press Escape");

          if (!this.isFirstTime) {
            return false;
          }

          if (!this.isMenu) {
            this.openMenu();
          }
          break;
        case "KeyR":
          if (!this.isMenu) {
            this.movesCounter += 2;
            this.randomRotate(3);
          }
          break;
      }
    },

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
        this.newGameCall();
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
      this.log("Rotate pit call");

      this.$store.commit("rotatePit");

      this.pit.rotation.set(0, 0, this.pit.rotation.z + MathUtils.degToRad(90));

      this.updateCameraProjection();

      const elements = this.layersElements.flat();

      // Init layers after resize
      this.initLayers();
      this.initPoints();

      elements.forEach((item) =>
        item.rotation.set(0, 0, item.rotation.z + MathUtils.degToRad(90))
      );

      elements.forEach((el) => {
        const { x, y, z } = this.getElementLayerPointsForItem(el);

        el.userData.layer = { x, y, z };
        this.layersElements[z].push(el);
      });

      this.restrainElement(this.current);

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

    blocksType(newValue) {
      this.updateBlocksType(newValue);
    },

    // isGlitch(newValue) {
    //   this.glitchPass.enabled = newValue;
    // },

    // isTechnicolor(newValue) {
    //   this.technicolorShaderPass.enabled = newValue;
    // },

    // isDotScreenPass(newValue) {
    //   this.dotScreenPass.enabled = newValue;
    // },

    // isFilmPass(newValue) {
    //   this.filmPass.enabled = newValue;
    // },

    // isSAOPass(newValue) {
    //   this.SAOComposerPass.enabled = newValue;
    // },

    // isSSAOPass(newValue) {
    //   this.SSAOComposerPass.enabled = newValue;
    // },

    // isSSRPass(newValue) {
    //   this.SSRComposerPass.enabled = newValue;
    // },

    // isUnrealBloomPass(newValue) {
    //   this.UnrealBloomComposerPass.enabled = newValue;
    // },

    isControls() {
      this.updateControls();
    },

    isLevelHelpers() {
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

      this.closeMenu();
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

    document.addEventListener("keydown", this.keyHandler);
    document.addEventListener("keyup", this.keyUpHandler);

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

    document.removeEventListener("keydown", this.keyHandler);
    document.removeEventListener("keyup", this.keyUpHandler);

    this.emitter.off("openMenuScreen", this.openMenuScreen);
    this.emitter.off("closeMenuScreen", this.closeMenuScreen);

    this.emitter.off("how-to-play", this.openControlsInfo);
    this.emitter.off("newGame", this.newGame);

    this.emitter.off("vibrate", this.vibrateCall);
  },
};
