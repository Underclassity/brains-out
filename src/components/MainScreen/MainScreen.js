import { mapState } from "vuex";

import {
  AmbientLight,
  Audio,
  AudioListener,
  BoxGeometry,
  BoxHelper,
  Clock,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLightHelper,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

import * as TWEEN from "@tweenjs/tween.js";

import { loadPitParts, loadZombie } from "../../helpers/load-zombie.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import generatePit from "../../helpers/generate-pit.js";
import getGroupSize from "../../helpers/get-group-size.js";
import loadAudio from "../../helpers/audio.js";
import loadLights from "../../helpers/lights.js";
import log from "../../helpers/log.js";
import randomBetween from "../../helpers/random-between.js";

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
  setLayerPoint,
} from "./transform-helpers.js";
import { initWaterfall, createElement } from "./waterfall.js";
import colorPalette from "./color-palette.js";
import getRandomForm from "./get-random-form.js";
import initPoints from "./init-points.js";
// import initTest from "./init-test.js";

// import MenuComponent from "../MenuComponent/MenuComponent.vue";
import AcceptBugsScreen from "../AcceptBugsScreen/AcceptBugsScreen.vue";
import LoadingScreen from "../LoadingScreen/LoadingScreen.vue";
import LogoScreen from "../LogoScreen/LogoScreen.vue";
import MenuScreen from "../MenuScreen/MenuScreen.vue";

export default {
  name: "MainScreen",

  data() {
    return {
      size: 1,

      minSpeed: 0.5,
      speed: 0.5,
      maxSpeed: 10,
      speedSettings: 0.5,
      speedStep: 0.1,
      score: 0,
      lsScore: [],
      prevScore: 0,

      layers: new Array(12),
      layersElements: new Array(12),
      elements: [],
      pitLevels: undefined,
      colorPalette,

      delta: 0,
      timeDelta: 0,
      second: 0,

      fov: 70,
      lightPower: 5000,

      gridColor: 0x9b_43_0e,
      lightColor: 0xfa_fa_fa,
      sceneColor: 0x00_0b_12,

      isPause: true,
      isMenu: true,
      isSmooth: true,
      isSimple: false,
      isEnd: false,
      isControls: false,
      isInstanced: true,
      isStop: false,

      changeSpeedByLevels: true,

      isMobile: false,

      isAccepted: false,
      isLogo: false,
      isDev: false,

      isLoading: true,
      loadingProcessCache: {},

      isRandomColor: false,
      isColorizeLevel: true,

      orbitControls: false,
      helpers: false,

      bgSoundId: "ZombiesAreComing.aac",
      bgMenuSoundId: "Rising.ogg",
      fallSoundId: ["burp_01.ogg", "burp_02.ogg"],
      rotationSoundId: ["troll_01.ogg"],
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
      "volume",
      "fxVolume",

      "pitWidth",
      "pitHeight",
      "pitDepth",
      "pitSize",

      "blocksTypeOptions",
      "blocksType",
    ]),

    zombie() {
      const { scene } = this;

      return scene.children.find((item) => item.userData.name == "Zombie");
    },

    time() {
      return this.isSmooth ? this.timeDelta : this.second;
    },

    maxScore() {
      return this.lsScore.length ? Math.max(...this.lsScore) : 0;
    },

    minScore() {
      return this.lsScore.length ? Math.min(...this.lsScore) : 0;
    },

    avgScore() {
      return this.lsScore.length
        ? this.lsScore.reduce((prev, curr) => {
            return prev + curr;
          }, 0) / this.lsScore.length
        : 0;
    },

    loadPercent() {
      const { loadingProcessCache } = this;

      // 10 objects to download
      const count = 10;

      let totalCount = 0;

      for (const id in loadingProcessCache) {
        totalCount += loadingProcessCache[id].percent;
      }

      return totalCount / count;
    },
  },

  methods: {
    updateRendererSize() {
      this.isMobile =
        window.innerWidth / window.innerHeight < 1 && window.innerWidth < 1024
          ? true
          : false;

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

          this.updateCameraProjection();
        }, 10);
      });

      return true;
    },

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

    loadScore() {
      const scoreItems = localStorage.getItem("score");
      const lsScore = scoreItems ? JSON.parse(scoreItems) : [];

      if (!lsScore.length) {
        localStorage.setItem("score", JSON.stringify(lsScore));
      }

      log(`Load score ${lsScore} from localStorage`);

      // Update value
      this.lsScore = lsScore;

      return lsScore;
    },

    speedUp() {
      this.speed += this.speedStep;

      log("Update speed to: ", this.speed);

      const newPlaybackRate =
        (this.speed - this.minSpeed) / this.speedStep / 10 + 1;

      log("Update bg playbackrate to: ", newPlaybackRate);

      this.bgSound.playbackRate = newPlaybackRate;

      return true;
    },

    changeScore(changeValue) {
      this.score += changeValue;

      if (this.changeSpeedByLevels) {
        this.prevScore = this.score;
      } else if (this.score - this.prevScore >= 50) {
        this.prevScore = this.score;
        this.speedUp();
      }

      return true;
    },

    updateScore() {
      const { score } = this;

      log(`Update score ${score} in localStorage`);

      const scoreItems = localStorage.getItem("score");
      const lsScore = scoreItems ? JSON.parse(scoreItems) : [];

      if (!lsScore.length) {
        localStorage.setItem("score", JSON.stringify(lsScore));
      }

      localStorage.setItem("score", JSON.stringify([...lsScore, score]));

      // Update value
      this.lsScore = [...lsScore, score];

      return localStorage.getItem("score")
        ? JSON.parse(localStorage.getItem("score"))
        : [];
    },

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
    },

    openMenu() {
      log("Open menu");

      this.isPause = true;
      this.isMenu = true;
      this.isLogo = false;

      this.emitter.emit("openMenu");
    },

    closeMenu() {
      log("Close menu");

      this.isPause = false;
      this.isMenu = false;
      this.isLogo = false;

      this.emitter.emit("closeMenu");
    },

    newGameCall() {
      this.closeMenu();
      this.newGame();
    },

    backToGameCall() {
      this.closeMenu();
    },

    changeSpeed(speed) {
      log(`Update speed to: ${speed}`);
      this.speedSettings = parseInt(speed);
    },

    pauseCall() {
      log("Pause call");
      this.isPause = true;
    },

    playCall() {
      log("Play call");
      this.isPause = false;
    },

    updateSmooth(isSmooth) {
      this.isSmooth = isSmooth ? true : false;
      log(`Smooth updated: ${this.isSmooth}`);
    },

    updateInstanced(isInstanced) {
      this.isInstanced = isInstanced ? true : false;
      log(`Instanced updated: ${this.isInstanced}`);
      this.newGame();
    },

    updateSimple(isSimple) {
      this.isSimple = isSimple ? true : false;
      log(`Simple updated: ${this.isSimple}`);
      this.newGame();
    },

    updateControls(isControls) {
      this.isControls = isControls ? true : false;
      this.updateRendererSize();
      log(`Controls updated: ${this.isControls}`);
    },

    updateSound(sound) {
      this.bgSoundId = sound;
      log(`Update sound: ${sound}`);

      this.initAudio();
    },

    updateVolume(volume) {
      log(`Update volume: ${volume}`);

      if (this.bgSound) {
        this.bgSound.setVolume(volume);
      }

      if (this.bgMenuSound) {
        this.bgMenuSound.setVolume(volume);
      }
    },

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
    },

    updateDevMode(devMode) {
      this.isDev = devMode;
      log(`Dev mode updated: ${devMode}`);
    },

    updateBlocksType(blocksType) {
      log(`Update blocks type: ${blocksType}`);
    },

    newGame() {
      log("New game call");

      const { scene } = this;

      // Reset score and speed
      this.score = 0;
      this.speed = this.speedSettings;

      this.isEnd = false;

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

      this.initLevelPreview();
      this.updateLayersPreview();

      this.createElement();

      return true;
    },

    initLayer(z) {
      // log(`Init layer ${z}`);

      const { pitWidth, pitHeight } = this;

      this.layers[z] = [];
      this.layersElements[z] = new Array(pitWidth * pitHeight);

      for (let x = 0; x < pitWidth; x++) {
        this.layers[z][x] = [];

        for (let y = 0; y < pitHeight; y++) {
          this.setLayerPoint(x, y, z, 0);
          // this.layers[z][x][y] = 0;
        }
      }
    },

    initLayers() {
      log("Init layers");

      const { pitWidth, pitHeight, pitDepth } = this;

      log(`Init layers: ${pitDepth}-${pitWidth}-${pitHeight}`);

      this.layers = [];
      this.layersElements = [];

      for (let z = 0; z < pitDepth; z++) {
        this.initLayer(z);
      }

      return true;
    },

    async initBgSound() {
      const { scene, bgSoundId, camera, volume } = this;

      // instantiate a listener
      const audioListener = new AudioListener();

      // add the listener to the camera
      camera.add(audioListener);

      // instantiate audio object
      const soundInstance = new Audio(audioListener);

      // add the audio object to the scene
      scene.add(soundInstance);

      const audioBuffer = await loadAudio(bgSoundId, this.progressCb);

      soundInstance.setBuffer(audioBuffer);

      soundInstance.setLoop(true);
      soundInstance.setVolume(volume);

      this.bgSound = soundInstance;

      let counter = 0;
      while (
        Math.round(this.bgSound.getVolume() * 100) / 100 != volume &&
        counter <= 100
      ) {
        this.bgSound.setVolume(volume);
        counter++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    },

    async initBgMenuSound() {
      const { scene, bgMenuSoundId, camera, volume } = this;

      // instantiate a listener
      const audioListener = new AudioListener();

      // add the listener to the camera
      camera.add(audioListener);

      // instantiate audio object
      const soundInstance = new Audio(audioListener);

      // add the audio object to the scene
      scene.add(soundInstance);

      const audioBuffer = await loadAudio(bgMenuSoundId, this.progressCb);

      soundInstance.setBuffer(audioBuffer);

      soundInstance.setLoop(true);
      soundInstance.setVolume(volume);

      // soundInstance.play();

      this.bgMenuSound = soundInstance;

      let counter = 0;
      while (
        Math.round(this.bgMenuSound.getVolume() * 100) / 100 != volume &&
        counter <= 100
      ) {
        this.bgMenuSound.setVolume(volume);
        counter++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    },

    async initDropSound() {
      const { scene, camera, fallSoundId, fxVolume } = this;

      for (const id of fallSoundId) {
        const audioListener = new AudioListener();
        camera.add(audioListener);

        const soundInstance = new Audio(audioListener);
        scene.add(soundInstance);

        const audioBuffer = await loadAudio(id, this.progressCb);

        soundInstance.setBuffer(audioBuffer);
        soundInstance.setVolume(fxVolume);

        this.dropSounds[id] = soundInstance;
      }

      return true;
    },

    async initEndSound() {
      const { scene, camera, endGameSoundId, fxVolume } = this;

      const audioListener = new AudioListener();
      camera.add(audioListener);

      const soundInstance = new Audio(audioListener);
      scene.add(soundInstance);

      const audioBuffer = await loadAudio(endGameSoundId, this.progressCb);

      soundInstance.setBuffer(audioBuffer);
      soundInstance.setVolume(fxVolume);

      this.endSound = soundInstance;

      return soundInstance;
    },

    async initClearSound() {
      const { scene, camera, levelSoundId, fxVolume } = this;

      const audioListener = new AudioListener();
      camera.add(audioListener);

      const soundInstance = new Audio(audioListener);
      scene.add(soundInstance);

      const audioBuffer = await loadAudio(levelSoundId, this.progressCb);

      soundInstance.setBuffer(audioBuffer);
      soundInstance.setVolume(fxVolume);

      this.clearSound = soundInstance;

      return soundInstance;
    },

    async initRotateSounds() {
      const { rotationSoundId, scene, fxVolume, camera } = this;

      for (const id of rotationSoundId) {
        if (this.rotateSounds[id]) {
          continue;
        }

        const audioListener = new AudioListener();
        camera.add(audioListener);

        const soundInstance = new Audio(audioListener);
        scene.add(soundInstance);

        const audioBuffer = await loadAudio(id, this.progressCb);

        soundInstance.setBuffer(audioBuffer);
        soundInstance.setVolume(fxVolume);

        this.rotateSounds[id] = soundInstance;
      }

      return true;
    },

    async initAudio() {
      const { scene, camera, bgSound } = this;

      if (!scene || !camera) {
        return false;
      }

      // // Update sound
      // if (bgSound) {
      //   const audioBuffer = await loadAudio(bgSoundId, this.progressCb);

      //   bgSound.stop();
      //   bgSound.setBuffer(audioBuffer);
      //   bgSound.play();

      //   return true;
      // }

      await this.initBgSound();
      await this.initBgMenuSound();
      await this.initDropSound();
      await this.initEndSound();
      await this.initClearSound();
      await this.initRotateSounds();

      return bgSound;
    },

    getoLayersElementsLevelPoints() {
      return this.layersElements
        .reduce((prev, curr) => {
          prev.push(...curr);
          return prev;
        }, [])
        .filter((item) => item)
        .map((item) => item.position)
        .map((item) => {
          return {
            x: this.xCPoints.indexOf(item.x),
            y: this.yCPoints.indexOf(item.y),
            z: this.zCPoints.indexOf(item.z),
          };
        });
    },

    findElementIndexes(child) {
      const { xCPoints, yCPoints, zPoints, size } = this;

      const half = size / 2;

      const position = new Vector3(0, 0, 0);
      child.getWorldPosition(position);

      let { x, y, z } = position;

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

      if (xIndex == -1 || yIndex == -1 || zIndex == -1) {
        debugger;
      }

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

    findCollissionElements(element) {
      log(`Find collision elements: ${element.name}`);

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

    collisionElement(element) {
      const childs = element.getObjectByName("childs").children;

      let isFreeze = false;

      for (const child of childs) {
        if (isFreeze) {
          continue;
        }

        const { x, y, z, pX, pY, pZ } = this.findElementIndexes(child);

        if (z != -1 && x != -1 && y != -1) {
          if (this.layers[z + 1]) {
            if (
              this.layers[z + 1] == undefined ||
              this.layers[z + 1][x] == undefined ||
              this.layers[z + 1][x][y] == undefined
            ) {
              this.error = `Layer not found ${
                element.name
              }!(${x}-${y}-${z})(${pX.toFixed(1)}-${pY.toFixed(1)}-${pZ.toFixed(
                1
              )})(${child.position.x.toFixed(1)}-${child.position.y.toFixed(
                1
              )}-${child.position.z.toFixed(1)})`;
              throw new Error(this.error);
            }

            const nextLayerValue = this.layers[z + 1][x][y];

            // log(
            //   this.layers[zIndex + 1].map((xLayer) => xLayer.join("-")).join("\n")
            // );

            if (nextLayerValue) {
              isFreeze = true;
            }
          } else {
            // Reached end
            isFreeze = true;
          }
        } else {
          this.error = `Index not found ${child.name}!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`;
          throw new Error(this.error);
        }
      }

      return isFreeze;
    },

    drop() {
      this.dropElement(this.current);
    },

    dropElement(element) {
      log(`Drop element: ${element.name}`);

      navigator.vibrate(100);

      element.userData.drop = true;

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

      if (collisionPoints.length) {
        // log(`Found ${collisionPoints.length} collision points`);

        const uuids = collisionPoints.map((item) => item.uuid);

        const maxZ = Math.max(...collisionPoints.map(({ z }) => z));

        const { uuid } = indexes.find(
          (item) => item.z === maxZ && uuids.includes(item.uuid)
        );
        const maxPoint = childs.find((item) => item.uuid === uuid);

        const collisionZ = collisionPoints.find(
          (item) => item.uuid == uuid
        ).zIndex;

        const maxPointPosition = new Vector3();
        maxPoint.getWorldPosition(maxPointPosition);

        const tZ = this.zPoints[collisionZ] - maxPointPosition.z;

        this.translateHelper(element, "z", tZ);
      } else {
        this.positionHelper(
          element,
          "z",
          this.zPoints[this.zPoints.length - 1]
        );
        this.restrainElement(element);
      }

      return element;
    },

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

    layersCheck() {
      const { layers } = this;

      let filledLevelsCounter = 0;

      for (const [index, zLayer] of layers.entries()) {
        const layerValues = zLayer.reduce((prev, current) => {
          prev.push(...current);

          return prev;
        }, []);

        if (layerValues.includes(0)) {
          continue;
        }

        log(`Process layer delete: ${index}`);

        filledLevelsCounter++;

        // Update speed level
        if (this.changeSpeedByLevels) {
          this.speedUp();
        }

        const layerElements = this.layersElements[index];

        // Delete all layer elements
        for (const element of layerElements) {
          this.scene.remove(element);
        }

        // Move all elements by one level
        this.layers.splice(index, 1);
        this.layers.unshift(0);
        this.initLayer(0);

        if (this.clearSound) {
          this.clearSound.play();
        }
      }

      // Update score by tetris formula: https://en.wikipedia.org/wiki/Tetris
      if (filledLevelsCounter) {
        const scoreDiff =
          10 * (filledLevelsCounter - 1) * filledLevelsCounter + 10;

        log(`Levels ${filledLevelsCounter} score: ${scoreDiff}`);

        this.changeScore(scoreDiff);
      }

      return true;
    },

    petrify(element) {
      const collisionPoints = this.findCollissionElements(element);

      const childs = element.getObjectByName("childs").children;

      const indexes = childs.map(this.findElementIndexes);

      const position = element.position;

      log(
        `Petrify element: ${element.name}(${position.x.toFixed(
          1
        )}-${position.y.toFixed(1)}-${position.z.toFixed(1)})`
      );

      let zOffset = 0;

      for (let { z, uuid } of indexes) {
        const collisionPoint = collisionPoints.find(
          (item) => item.uuid == uuid
        );

        if (!collisionPoint) {
          continue;
        }

        if (!collisionPoint.el.userData.size) {
          collisionPoint.el.userData.size = getGroupSize(collisionPoint.el);
        }

        if (
          collisionPoint &&
          (collisionPoint.z != collisionPoint.zIndex ||
            collisionPoint.z != z ||
            collisionPoint.zIndex != z)
        ) {
          const zIndexDiff = collisionPoint.zIndex - collisionPoint.z;

          if ((!zOffset || zOffset != zIndexDiff) && zIndexDiff < 0) {
            zOffset = zIndexDiff;
          }
        }
      }

      for (let { x, y, z, pX, pY, pZ, el } of indexes) {
        z += zOffset;

        if (z != -1 && x != -1 && y != -1) {
          if (
            this.layers[z] == undefined ||
            this.layers[z][x] == undefined ||
            this.layers[z][x][y] == undefined
          ) {
            this.error = `Element not found in layers!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`;
            throw new Error(this.error);
          }

          if (this.layers[z][x][y] && !element.userData.drop) {
            this.changeScore(indexes.length);
            this.updateScore();

            log(
              `Element already petrified!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
            );
            this.isEnd = true;
            this.openMenu();

            navigator.vibrate(500);

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
            return false;
          }

          this.changeScore(1);

          this.setLayerPoint(x, y, z);

          this.positionHelper(el, "x", pX);
          this.positionHelper(el, "y", pY);
          this.positionHelper(el, "z", this.zPoints[z] - this.size / 2);

          el.userData.static = true;

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
        } else {
          this.error = `Index not found!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`;
          throw new Error(this.error);
        }
      }

      // Remove element after process layers
      this.scene.remove(element);

      // Check layers
      this.layersCheck();

      this.updateLayersPreview();
      this.updateLayersPreview();

      // log(
      //   this.layers
      //     .map((layer) => {
      //       return layer.map((xLayer) => xLayer.join("-")).join("\n");
      //     })
      //     .join("\n" + new Array(pitWidth).join("-") + "\n")
      // );

      return true;
    },

    positionHelper,
    rotateHelper,
    translateHelper,
    setLayerPoint,

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

    restrainElement(element) {
      if (!element) {
        return false;
      }

      const { pitWidth, pitHeight, pitDepth, xPoints, yPoints } = this;

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

      if (position.z <= -pitDepth + sizeZ / 2) {
        this.positionHelper(element, "z", -pitDepth + sizeZ / 2);
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

      this.score = 0;
      this.speed = this.minSpeed;

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
      this.initLayers();
      this.initPoints();
      this.initLights();
      this.initLevelPreview();

      this.createElement();

      return true;
    },

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

    initLevelPreview() {
      const { pitDepth, pitWidth, pitHeight, size } = this;

      if (this.pitLevels) {
        this.scene.remove(this.pitLevels);
        if (this.pitLevels.dispose) {
          this.pitLevels.dispose();
        }
        this.pitLevels = undefined;
      }

      this.pitLevels = new Group();
      this.pitLevels.scale.set(0.5, 0.5, 0.5);

      this.pitLevels.position.set(-pitWidth / 2 - 1, 0, 1);

      const gridColor = new Color(this.gridColor);

      for (let i = 0; i < pitDepth; i++) {
        const color = new Color(this.colorPalette[i]);

        const boxMaterial = new MeshBasicMaterial({ color });
        const boxGeometry = new BoxGeometry(1, 1);

        const boxMesh = new Mesh(boxGeometry, boxMaterial);

        boxMesh.position.set(0, -i - size / 2 + pitDepth / 2, 0);

        // Hide all
        boxMesh.visible = false;

        // Save level for process
        boxMesh.name = "level";
        boxMesh.userData.level = i;

        this.pitLevels.add(boxMesh);
        this.pitLevels.add(new BoxHelper(boxMesh, gridColor));
      }

      this.scene.add(this.pitLevels);

      return true;
    },

    updateLayersPreview() {
      log("Update layers preview");

      const { layers, pitLevels } = this;

      const meshes = pitLevels.children.filter((item) => item.name == "level");

      for (const [index, zLayer] of layers.entries()) {
        const layerValues = zLayer.reduce((prev, current) => {
          prev.push(...current);

          return prev;
        }, []);

        const mesh = meshes.find((item) => item.userData.level == index);

        mesh.visible = layerValues.includes(1) ? true : false;
      }

      return true;
    },

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

    async initLights() {
      const { scene, camera, pitWidth } = this;

      const gltf = await loadLights(this.progressCb);

      const light = new AmbientLight(0xff_ff_ff, 0.02);
      scene.add(light);

      const cameraLight = new AmbientLight(0xff_ff_ff, 0.08);
      camera.add(cameraLight);

      if (!gltf) {
        const light = new AmbientLight(this.lightColor);
        scene.add(light);
        return false;
      }

      const lights = gltf.scene.children;

      const l1 = lights[0].clone();
      const l2 = lights[1].clone();
      const l3 = lights[2].clone();

      l1.position.set(-pitWidth / 2, 0, 5);
      l2.position.set(pitWidth / 2, 0, 5);
      l3.position.set(0, 0, 5);

      l1.power = this.lightPower;
      l2.power = this.lightPower;
      l3.power = 0;

      // Save lights for process
      this.lights.l1 = l1;
      this.lights.l2 = l2;
      this.lights.l3 = l3;

      // hide red light
      l3.visible = false;

      scene.add(l1);
      scene.add(l2);
      scene.add(l3);

      if (this.helpers) {
        const sphereSize = 1;

        let pointLightHelper = new PointLightHelper(l1, sphereSize);
        scene.add(pointLightHelper);

        pointLightHelper = new PointLightHelper(l2, sphereSize);
        scene.add(pointLightHelper);

        pointLightHelper = new PointLightHelper(l3, sphereSize);
        scene.add(pointLightHelper);
      }

      return true;
    },

    initPoints,

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
      this.initLayers();
      this.initPoints();

      // Init light
      this.initLights();

      // Levels preview
      this.initLevelPreview();

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

        renderer.render(scene, camera);

        TWEEN.update();
      };

      const renderer = new WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setAnimationLoop(animation);
      renderer.gammaFactor = 2.2;
      container.appendChild(renderer.domElement);
      this.renderer = renderer;

      if (this.orbitControls) {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.maxZoom = 10;
        controls.maxDistance = 50;
        this.controls = controls;
      }

      this.updateRendererSize();
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

    clickListener() {
      // if (this.bgSound) {
      //   this.bgSound.play();
      // }
    },

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

      return false;
    },

    progressCb({ name, total, loaded, percent }) {
      this.loadingProcessCache[name] = { total, loaded, percent };

      log(`Loaded ${name}: ${this.loadPercent.toFixed(2)}`);

      if (this.loadPercent >= 1) {
        this.isLoading = false;
      }
    },

    playMusic() {
      log("Play music");
    },

    pauseMusic() {
      log("Pause music");

      this.isPause = true;
      this.isMenu = true;
    },

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
    },

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
    },
  },

  watch: {
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
  },

  beforeMount() {
    this.parseURLSearchParams();
  },

  async mounted() {
    this.loadScore();

    await this.loadZombie();
    this.initAudio();
    this.init();

    window.addEventListener("resize", this.updateRendererSize);
    window.addEventListener("orientationchange", this.updateRendererSize);
    window.addEventListener("focus", this.playMusic);
    window.addEventListener("blur", this.pauseMusic);
    document.addEventListener("keyup", this.keyupHandler);
    window.addEventListener("click", this.clickListener);

    this.emitter.on("changeSpeed", this.changeSpeed);
    this.emitter.on("updateControls", this.updateControls);
    this.emitter.on("updateDevMode", this.updateDevMode);

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
    window.removeEventListener("click", this.clickListener);

    this.emitter.off("changeSpeed", this.changeSpeed);
    this.emitter.off("updateControls", this.updateControls);
    this.emitter.off("updateDevMode", this.updateDevMode);

    this.emitter.off("openMenuScreen", this.openMenuScreen);
    this.emitter.off("closeMenuScreen", this.closeMenuScreen);

    this.emitter.off("newGame", this.newGame);
  },
};
