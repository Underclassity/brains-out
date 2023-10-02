import { mapState, mapGetters } from "vuex";

import {
  Clock,
  Color,
  MathUtils,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

import * as TWEEN from "@tweenjs/tween.js";

import { loadPitParts, loadZombie } from "../../helpers/load-zombie.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import generatePit from "../../helpers/generate-pit.js";
// import getGroupSize from "../../helpers/get-group-size.js";
import log from "../../helpers/log.js";
import randomBetween from "../../helpers/random-between.js";
import roundValue from "../../helpers/round-value.js";

import {
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  rotateXMinus,
  rotateXPlus,
  rotateYMinus,
  rotateYPlus,
  rotateZMinus,
  rotateZPlus,
  playRandomRotateSound,
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

      gridColor: 0x9b_43_0e,
      lightColor: 0xfa_fa_fa,
      sceneColor: 0x00_0b_12,

      isPause: true,
      isMenu: true,
      isSmooth: true,
      isSimple: false,
      isEnd: false,
      isInstanced: true,
      isStop: false,
      isPetrify: false,
      isFastDrop: true,
      isLevelHelpers: false,

      changeSpeedByLevels: true,

      isMobile: false,

      isAccepted: false,
      isLogo: false,

      isLoading: true,
      loadingProcessCache: {},

      isRandomColor: false,
      isColorizeLevel: true,
      isRotateAnimation: false,
      isRotating: false,

      orbitControls: false,
      helpers: false,

      bgSoundId: "ZombiesAreComing.aac",
      bgMenuSoundId: "Rising.ogg",
      fallSoundId: ["burp_01.ogg", "burp_02.ogg"],
      rotationSoundId: ["cloth3.ogg"],
      endGameSoundId: "zombieHoouw_1.aac",
      levelSoundId: "Zombie Sound.aac",

      bgSound: undefined,
      bgMenuSound: undefined,
      endSound: undefined,
      clearSound: undefined,
      rotateSounds: {},
      dropSounds: {},

      camera: undefined,
      scene: undefined,
      renderer: undefined,
      controls: undefined,
      pit: undefined,

      isShaders: false,
      composer: undefined,

      isDotScreenPass: false,
      isFilmPass: false,
      isGlitch: false,
      isSAOPass: false,
      isSSAOPass: false,
      isSSRPass: false,
      isTechnicolor: false,
      isUnrealBloomPass: false,

      dotScreenPass: undefined,
      filmPass: undefined,
      glitchPass: undefined,
      SAOComposerPass: undefined,
      SSAOComposerPass: undefined,
      SSRComposerPass: undefined,
      technicolorShaderPass: undefined,
      UnrealBloomComposerPass: undefined,

      lights: {
        l1: undefined,
        l2: undefined,
        l3: undefined,
      },

      resizeTimeout: undefined,

      isRotateRestrain: false,
      maxRotate: 5,
      rotateCount: 0,

      prevColor: undefined,
      prevCorner: undefined,
      current: undefined,
      next: undefined,

      zombieParts: [],
      pitParts: [],

      fps: 0,
      frames: 0,
      pixelRatio: window.devicePixelRatio,
      antialias: true,
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
    ]),

    ...mapGetters(["maxScore", "minScore", "avgScore"]),

    zombie() {
      const { scene } = this;

      return scene.children.find((item) => item.userData.name == "Zombie");
    },

    time() {
      return this.isSmooth ? this.timeDelta : this.second;
    },

    loadPercent() {
      const { loadingProcessCache } = this;

      let count = 4;

      count += this.fallSoundId.length;
      count += this.rotationSoundId.length;

      count += 3;

      // // 10 objects to download
      // const count = 10;

      let totalCount = 0;

      for (const id in loadingProcessCache) {
        totalCount += loadingProcessCache[id].percent;
      }

      return totalCount / count;
    },
  },

  methods: {
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
          log("Resize call");

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

      log(
        `Update camera projection call: ${pitWidth}-${pitHeight}-${pitDepth}`
      );

      const offset = camera.aspect > 1 ? 2.5 : 0;

      const maxSize = Math.max(pitWidth, pitHeight, 0) + offset;
      const fitHeightDistance =
        maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = 2 * Math.max(fitHeightDistance, fitWidthDistance);

      camera.position.setZ(distance - maxSize);

      if (controls) {
        controls.update();
      }

      this.updatePreview();

      return true;
    },

    /**
     * Update speed by up value
     *
     * @return  {Boolean}  Result
     */
    speedUp() {
      this.$store.commit("updateSpeed", this.speedStep);

      log("Update speed to: ", this.speed);

      const newPlaybackRate =
        (this.speed - this.minSpeed) / this.speedStep / 10 + 1;

      log("Update bg playbackrate to: ", newPlaybackRate);

      this.bgSound.playbackRate = newPlaybackRate;

      return true;
    },

    /**
     * Change score value
     *
     * @param   {Number}  changeValue  Value diff
     *
     * @return  {Boolean}              Result
     */
    changeScore(changeValue) {
      this.$store.commit("updateScore", changeValue);

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
      log("Accepted call");
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
      log("Open menu");

      this.isPause = true;
      this.isMenu = true;
      this.isLogo = false;

      this.emitter.emit("openMenu");

      return true;
    },

    /**
     * Close menu call
     *
     * @return  {Boolean}  Result
     */
    closeMenu() {
      log("Close menu");

      this.isPause = false;
      this.isMenu = false;
      this.isLogo = false;

      this.emitter.emit("closeMenu");

      return true;
    },

    /**
     * New game call helper
     *
     * @return  {Boolean}  Result
     */
    newGameCall() {
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
      this.closeMenu();

      return true;
    },

    /**
     * Pause call helper
     *
     * @return  {Boolean}  Result
     */
    pauseCall() {
      log("Pause call");
      this.isPause = true;

      return true;
    },

    /**
     * Play call helper
     *
     * @return  {Boolean}  Result
     */
    playCall() {
      log("Play call");
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
      this.isSmooth = isSmooth ? true : false;
      log(`Smooth updated: ${this.isSmooth}`);

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
      this.isInstanced = isInstanced ? true : false;
      log(`Instanced updated: ${this.isInstanced}`);

      this.newGame();

      return true;
    },

    updateSimple(isSimple) {
      this.isSimple = isSimple ? true : false;
      log(`Simple updated: ${this.isSimple}`);
      this.newGame();
    },

    updateControls() {
      this.updateRendererSize();
      log(`Controls updated: ${this.isControls}`);
    },

    updateSound(sound) {
      this.bgSoundId = sound;
      log(`Update sound: ${sound}`);

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
      log(`Update volume: ${volume}`);

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
      log(`Update FX volume: ${fxVolume}`);

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
      log(`Update blocks type: ${blocksType}`);
      return true;
    },

    /**
     * New game call helper
     *
     * @return  {Boolean}  Result
     */
    newGame() {
      log("New game call");

      const { scene } = this;

      // Reset score and speed
      this.$store.commit("resetScore");
      this.$store.commit("setSpeed", this.settingsSpeed);

      this.isEnd = false;
      this.isPetrify = false;

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

          const itemPosition = new Vector3();
          item.getWorldPosition(itemPosition);

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
     * Get element layers points
     *
     * @param   {Object}  element  Element
     *
     * @return  {Array}            Points array
     */
    getElementLayerPoints(element) {
      return element
        .getObjectByName("childs")
        .children.map((item) => {
          const itemPosition = new Vector3();
          item.getWorldPosition(itemPosition);

          return {
            x: roundValue(itemPosition.x),
            y: roundValue(itemPosition.y),
            z: roundValue(itemPosition.z),
            uuid: item.uuid,
          };
        })
        .map((item) => {
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
            uuid: item.uuid,
          };
        });
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

      const position = new Vector3(0, 0, 0);
      child.getWorldPosition(position);

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
      // log(`Find collision elements: ${element.name}`);

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
            return item.x == point.x && item.y == point.y;
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

        if (layer) {
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

        //     // log(
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
      this.dropElement(this.current);
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
      log(`Drop element: ${element.name}`);

      navigator.vibrate(100);

      element.userData.drop = true;

      const { z, points } = this.getCollisionPoints(element);

      if (z.length) {
        let minDiff = undefined;

        for (const { item, point } of z) {
          const pointElement = element.getObjectByProperty("uuid", point.uuid);

          const itemPosition = new Vector3();
          pointElement.getWorldPosition(itemPosition);

          const layerPosition = this.zCPoints[item.z - 1];

          const diff = layerPosition - itemPosition.z;

          if (minDiff == undefined) {
            minDiff = diff;
          } else if (diff > minDiff) {
            minDiff = diff;
          }
        }

        this.translateHelper(element, "z", minDiff);
      } else {
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

        const itemPosition = new Vector3();
        lowerElement.getWorldPosition(itemPosition);

        const layerPosition = this.zCPoints[this.zCPoints.length - 1];

        const diff = layerPosition - itemPosition.z;

        this.translateHelper(element, "z", diff);
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
      //   // log(`Found ${collisionPoints.length} collision points`);

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

      log(
        `Colorize element ${
          element.name
        } on layer ${layer}: ${color.getHexString()}`,
        `color: #${color.getHexString()}`
      );

      element.traverse((obj) => {
        if (!obj.isMesh) {
          return;
        }

        obj.material = new MeshBasicMaterial({ color });
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

      log(`Process layer delete: ${zIndex}`);

      // Update speed level
      if (this.changeSpeedByLevels) {
        this.speedUp();
      }

      const headElements = layerElements.filter((item) =>
        item.name.includes("Head")
      );

      if (headElements.length == layerElements.length) {
        this.emitter.emit("addAchievement", "zombieland");
      }

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

      log(`Layers indexes after delete layer ${zIndex}`, layers);

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
        if (filledLevelsCounter >= 3) {
          this.emitter.emit("addAchievement", "sanitizer");
        }

        const scoreDiff =
          10 * (filledLevelsCounter - 1) * filledLevelsCounter + 10;

        log(`Levels ${filledLevelsCounter} score: ${scoreDiff}`);

        this.changeScore(scoreDiff);
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

      log(`End game call on element: ${element.name}`);

      this.changeScore(elementPoints.length);

      if (this.score <= this.pitDepth) {
        this.emitter.emit("addAchievement", "are-you-playing");
      }

      this.$store.commit("saveScore");

      this.$store.commit("incrementEndGameCounter");

      this.isEnd = true;
      navigator.vibrate(500);

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
     * @param   {Object}  element  Element
     *
     * @return  {Boolean}          Result
     */
    petrify(element) {
      this.isPetrify = true;

      const elementPoints = this.getElementLayerPoints(element);

      for (const { x, y, z, uuid } of elementPoints) {
        if (this.layers[z][x][y]) {
          this.endGameCall(element);
          return false;
        }

        const el = element.getObjectByProperty("uuid", uuid);

        const itemPosition = new Vector3();
        el.getWorldPosition(itemPosition);

        this.positionHelper(el, "x", itemPosition.x);
        this.positionHelper(el, "y", itemPosition.y);
        this.positionHelper(el, "z", itemPosition.z);

        this.changeScore(1);

        this.setLayerPoint(x, y, z);

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

      // const collisionPoints = this.findCollissionElements(element);

      // const childs = element.getObjectByName("childs").children;

      // const indexes = childs.map(this.findElementIndexes);

      // const position = element.position;

      // log(
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

      //       log(
      //         `Element already petrified!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
      //       );
      //       this.isEnd = true;
      //       this.openMenu();

      //       navigator.vibrate(500);

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

      // log(
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

    rotateXMinus,
    rotateXPlus,
    rotateYMinus,
    rotateYPlus,
    rotateZMinus,
    rotateZPlus,

    playRandomRotateSound,

    createElement,
    initWaterfall,

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

      const position = new Vector3();
      element.getWorldPosition(position);

      // const sizeBefore = element.userData.size;

      const { x: sizeX, y: sizeY, z: sizeZ } = element.userData.size;

      // if (sizeBefore.x != sizeX) {
      //   log("Move to X point");
      //   element.translateX((sizeBefore.x - sizeX) / 2);
      // }

      // if (sizeBefore.y != sizeY) {
      //   log("Move to Y point");
      //   element.translateY((sizeBefore.y - sizeY) / 2);
      // }

      // log(
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
        // log("x before", xPosition);

        xPoints.forEach((point, index, array) => {
          if (xPosition > point && xPosition < array[index + 1]) {
            this.translateHelper(element, "x", point - xPosition);
          }
        });

        // log("x after", element.position.x);
      }

      if (!yPoints.includes(yPosition)) {
        // log("y before", yPosition);

        yPoints.forEach((point, index, array) => {
          if (yPosition > point && yPosition < array[index + 1]) {
            this.translateHelper(element, "y", point - yPosition);
          }
        });

        // log("y after", element.position.y);
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

      if (position.z <= -pitDepth + sizeZ / 2 - size / 2) {
        this.positionHelper(element, "z", -pitDepth + sizeZ / 2 - size / 2);
      }

      if (position.z >= -sizeZ / 2) {
        this.positionHelper(element, "z", -sizeZ / 2);
      }

      // const newPosition = new Vector3();
      // element.getWorldPosition(position);

      // if (newPosition.x != position.x) {
      //   log(`X: ${position.x} -> ${newPosition.x}`);
      // }

      // if (newPosition.y != position.y) {
      //   log(`Y: ${position.y} -> ${newPosition.y}`);
      // }

      // if (newPosition.z != position.z) {
      //   log(`Z: ${position.z} -> ${newPosition.z}`);
      // }

      return element;
    },

    /**
     * Change pit size helper
     *
     * @param   {String}  pitSize  New pit size string
     *
     * @return  {Boolean}          Result
     */
    changePitSize(pitSize) {
      const { scene, renderer, size } = this;

      this.pitSize = pitSize;

      const [width, height, depth] = pitSize.split("x");

      log(`Change pit size to ${pitSize}`);

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

      this.pitWidth = width;
      this.pitHeight = height;
      this.pitDepth = depth;

      scene.remove(this.pit);

      renderer.renderLists.dispose();

      this.pit = generatePit(
        width,
        height,
        depth,
        size,
        this.gridColor,
        this.pitParts,
        this.isSimple,
        this.isInstanced
      );
      scene.add(this.pit);

      this.updateCameraProjection();

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
      const zombie = await loadZombie(this.progressCb);
      const pitParts = await loadPitParts(this.progressCb);

      if (!zombie || !pitParts) {
        this.isSimple = true;
        return false;
      }

      for (const child of pitParts.children) {
        this.pitParts.push(child);

        if (Array.isArray(child.material)) {
          child.material.forEach((item, index, array) => {
            item.shininess = 0;
            item.specular = new Color(0x00_00_00);
            item.flatShading = true;
          });
        } else {
          child.material.shininess = 0;
          child.material.specular = new Color(0x00_00_00);
          child.material.flatShading = true;
        }
      }

      // Save all parts
      for (const child of zombie.children) {
        this.zombieParts.push(child);

        if (Array.isArray(child.material)) {
          child.material.forEach((item, index, array) => {
            item.shininess = 0;
            item.specular = new Color(0x00_00_00);
            item.flatShading = true;
          });
        } else {
          child.material.shininess = 0;
          child.material.specular = new Color(0x00_00_00);
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
      // log("Update preview call");

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

      const pit = generatePit(
        this.pitWidth,
        this.pitHeight,
        this.pitDepth,
        this.size,
        this.gridColor,
        this.pitParts,
        this.isSimple,
        this.isInstanced
      );
      scene.add(pit);
      this.pit = pit;

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

      // animation

      let timeDelta = 0;

      const animation = () => {
        this.frames++;
        const time = Date.now();

        if (time >= this.prevTime + 1000) {
          this.fps = Math.round((this.frames * 1000) / (time - this.prevTime));
          this.frames = 0;
          this.prevTime = time;
        }

        if (this.isStop) {
          return false;
        }

        const delta = clock.getDelta();

        if (!this.isPause) {
          timeDelta += delta;
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
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(this.pixelRatio);
      renderer.setAnimationLoop(animation);
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

      return true;
    },

    keyupHandler(event) {
      if (this.isMenu) {
        return false;
      }

      switch (event.code) {
        case "KeyQ":
          // log("Press Q");
          this.rotateZPlus();
          break;
        case "KeyE":
          // log("Press E");
          this.rotateZMinus();
          break;
        case "KeyW":
          // log("Press W");
          this.rotateXMinus();
          break;
        case "KeyS":
          // log("Press S");
          this.rotateXPlus();
          break;
        case "KeyA":
          // log("Press A");
          this.rotateYMinus();
          break;
        case "KeyD":
          // log("Press D");
          this.rotateYPlus();
          break;
        case "ArrowUp":
          // log("Press Up");
          this.moveUp();
          break;
        case "ArrowDown":
          // log("Press Down");
          this.moveDown();
          break;
        case "ArrowLeft":
          // log("Press Left");
          this.moveLeft();
          break;
        case "ArrowRight":
          // log("Press Right");
          this.moveRight();
          break;
        case "Space":
          // log("Press Space");
          // this.isPause = !this.isPause;

          this.current.userData.drop = true;
          break;
        case "Escape":
          // log("Press Escape");

          if (this.isMenu) {
            this.closeMenu();
          } else {
            this.openMenu();
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
      log("Parse URLSearchParams");

      const params = new URLSearchParams(window.location.search);

      for (let [id, value] of params.entries()) {
        if (value == "true") {
          value = true;
        }

        if (value == "false") {
          value = false;
        }

        if (id in this.$data) {
          log(`Update ${id}`, value);

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

      log(`Loaded ${name}: ${this.loadPercent.toFixed(2)}`);

      this.$store.commit("reportETA", this.loadPercent);

      if (this.loadPercent >= 1) {
        this.isLoading = false;
      }

      return true;
    },

    playMusic() {
      log("Play music");
    },

    pauseMusic() {
      log("Pause music");

      this.isPause = true;
      this.isMenu = true;
    },

    /**
     * Open menu screen helper
     *
     * @return  {Boolean}  Result
     */
    openMenuScreen() {
      if (this.bgMenuSound?.isPlaying) {
        return false;
      }

      log("Opened menu screen");

      const fadeOutTween = new TWEEN.Tween({
        volume: this.bgMenuSound.getVolume(),
      });
      fadeOutTween.to({ volume: this.volume }, 700);
      fadeOutTween.onUpdate(({ volume }) => {
        if (this.bgMenuSound) {
          this.bgMenuSound.setVolume(volume);
        }

        if (this.bgMenuSound && !this.bgMenuSound.isPlaying) {
          this.bgMenuSound.play();
        }
      });

      const fadeInTween = new TWEEN.Tween({ volume: this.bgSound.getVolume() });
      fadeInTween.to({ volume: 0 }, 700);
      fadeInTween.onUpdate(({ volume }) => {
        if (volume == 0 && this.bgSound) {
          this.bgSound.pause();
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
      if (this.bgSound?.isPlaying) {
        return false;
      }

      log("Closed menu screen");

      const fadeOutTween = new TWEEN.Tween({
        volume: this.bgSound.getVolume(),
      });
      fadeOutTween.to({ volume: this.volume }, 700);
      fadeOutTween.onUpdate(({ volume }) => {
        if (this.bgSound) {
          this.bgSound.setVolume(volume);
        }

        if (this.bgSound && !this.bgSound.isPlaying) {
          this.bgSound.play();
        }
      });

      const fadeInTween = new TWEEN.Tween({
        volume: this.bgMenuSound.getVolume(),
      });
      fadeInTween.to({ volume: 0 }, 700);
      fadeInTween.onUpdate(({ volume }) => {
        if (volume == 0 && this.bgMenuSound) {
          this.bgMenuSound.pause();
        }

        if (this.bgMenuSound) {
          this.bgMenuSound.setVolume(volume);
        }
      });

      fadeInTween.start();
      fadeOutTween.start();

      return true;
    },
  },

  watch: {
    endGameCounter(newValue) {
      if (newValue >= 50) {
        this.emitter.emit("addAchievement", "still-playing");
      }
    },

    rotateCount(newValue) {
      if (newValue >= 50) {
        this.emitter.emit("addAchievement", "keep-it-rolling");
      }
    },

    speed(newValue) {
      if (newValue == this.maxSpeed) {
        this.emitter.emit("addAchievement", "fast-and-furious");
      }
    },

    score(newValue) {
      if (newValue >= 2000) {
        this.emitter.emit("addAchievement", "proud-of-you");
      }
    },

    isRotateRestrain() {
      this.rotateCount = 0;
    },

    isLogo(newValue, oldValue) {
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

    isGlitch(newValue) {
      this.glitchPass.enabled = newValue;
    },

    isTechnicolor(newValue) {
      this.technicolorShaderPass.enabled = newValue;
    },

    isDotScreenPass(newValue) {
      this.dotScreenPass.enabled = newValue;
    },

    isFilmPass(newValue) {
      this.filmPass.enabled = newValue;
    },

    isSAOPass(newValue) {
      this.SAOComposerPass.enabled = newValue;
    },

    isSSAOPass(newValue) {
      this.SSAOComposerPass.enabled = newValue;
    },

    isSSRPass(newValue) {
      this.SSRComposerPass.enabled = newValue;
    },

    isUnrealBloomPass(newValue) {
      this.UnrealBloomComposerPass.enabled = newValue;
    },

    isControls() {
      this.updateControls();
    },

    isLevelHelpers(value) {
      this.updateLayersView();
    },
  },

  beforeMount() {
    this.parseURLSearchParams();
  },

  async mounted() {
    await this.loadZombie();
    this.initAudio();
    this.init();

    window.addEventListener("resize", this.updateRendererSize);
    window.addEventListener("orientationchange", this.updateRendererSize);
    window.addEventListener("focus", this.playMusic);
    window.addEventListener("blur", this.pauseMusic);
    document.addEventListener("keyup", this.keyupHandler);

    this.emitter.on("openMenuScreen", this.openMenuScreen);
    this.emitter.on("closeMenuScreen", this.closeMenuScreen);

    this.emitter.on("newGame", this.newGame);
  },

  unmounted() {
    window.removeEventListener("resize", this.updateRendererSize);
    window.removeEventListener("orientationchange", this.updateRendererSize);
    window.removeEventListener("focus", this.playMusic);
    window.removeEventListener("blur", this.pauseMusic);
    document.removeEventListener("keyup", this.keyupHandler);

    this.emitter.off("openMenuScreen", this.openMenuScreen);
    this.emitter.off("closeMenuScreen", this.closeMenuScreen);

    this.emitter.off("newGame", this.newGame);
  },
};
