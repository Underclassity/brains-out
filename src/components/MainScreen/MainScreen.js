import {
  AmbientLight,
  Audio,
  AudioListener,
  Clock,
  Color,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLightHelper,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

import { loadPitParts, loadZombie } from "../../helpers/load-zombie.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import generatePit from "../../helpers/generate-pit.js";
import loadAudio from "../../helpers/audio.js";
import loadLights from "../../helpers/lights.js";
import randomBetween from "../../helpers/random-between.js";

// Form functions
import generateP0Form from "../../helpers/blocks/p0.js";
import generateP1Form from "../../helpers/blocks/p1.js";
import generateP2Form from "../../helpers/blocks/p2.js";
import generateP3Form from "../../helpers/blocks/p3.js";
import generateP4Form from "../../helpers/blocks/p4.js";
import generateP5Form from "../../helpers/blocks/p5.js";
import generateP6Form from "../../helpers/blocks/p6.js";
import generateP7Form from "../../helpers/blocks/p7.js";
import generateP8Form from "../../helpers/blocks/p8.js";
import generateP9Form from "../../helpers/blocks/p9.js";

import generateP10Form from "../../helpers/blocks/p10.js";
import generateP11Form from "../../helpers/blocks/p11.js";
import generateP12Form from "../../helpers/blocks/p12.js";
import generateP13Form from "../../helpers/blocks/p13.js";
import generateP14Form from "../../helpers/blocks/p14.js";
import generateP15Form from "../../helpers/blocks/p15.js";
import generateP16Form from "../../helpers/blocks/p16.js";
import generateP17Form from "../../helpers/blocks/p17.js";
import generateP18Form from "../../helpers/blocks/p18.js";
import generateP19Form from "../../helpers/blocks/p19.js";

import generateP20Form from "../../helpers/blocks/p20.js";
import generateP21Form from "../../helpers/blocks/p21.js";
import generateP22Form from "../../helpers/blocks/p22.js";
import generateP23Form from "../../helpers/blocks/p23.js";
import generateP24Form from "../../helpers/blocks/p24.js";
import generateP25Form from "../../helpers/blocks/p25.js";
import generateP26Form from "../../helpers/blocks/p26.js";
import generateP27Form from "../../helpers/blocks/p27.js";
import generateP28Form from "../../helpers/blocks/p28.js";
import generateP29Form from "../../helpers/blocks/p29.js";

import generateP30Form from "../../helpers/blocks/p30.js";
import generateP31Form from "../../helpers/blocks/p31.js";
import generateP32Form from "../../helpers/blocks/p32.js";
import generateP33Form from "../../helpers/blocks/p33.js";
import generateP34Form from "../../helpers/blocks/p34.js";
import generateP35Form from "../../helpers/blocks/p35.js";
import generateP36Form from "../../helpers/blocks/p36.js";
import generateP37Form from "../../helpers/blocks/p37.js";
import generateP38Form from "../../helpers/blocks/p38.js";
import generateP39Form from "../../helpers/blocks/p39.js";
import generateP40Form from "../../helpers/blocks/p40.js";

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
} from "./move.js";
import {
  positionHelper,
  rotateHelper,
  translateHelper,
  setLayerPoint,
} from "./transform-helpers.js";
import { initWaterfall, createElement } from "./waterfall.js";
import initPoints from "./init-points.js";
import colorPalette from "./color-palette.js";
// import initTest from "./init-test.js";

import MenuComponent from "../MenuComponent/MenuComponent.vue";

export default {
  name: "MainScreen",

  data() {
    return {
      size: 1,

      minSpeed: 0.5,
      speed: 0.5,
      maxSpeed: 10,
      speedStep: 0.2,
      score: 0,
      lsScore: [],

      pitWidth: 5,
      pitHeight: 5,
      pitDepth: 12,

      blocksType: "flat",

      layers: new Array(12),
      layersElements: new Array(12),
      elements: [],
      colorPalette,

      delta: 0,
      timeDelta: 0,
      second: 0,

      fov: 70,
      lightPower: 5000,

      pitSize: "5x5x12",

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

      orbitControls: false,
      helpers: false,

      sound: "ZombiesAreComing.ogg",
      volume: 0.1,
      fxVolume: 0.7,

      bgSound: undefined,
      dropSound: undefined,
      endSound: undefined,
      clearSound: undefined,

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

      prevCorner: undefined,
      current: undefined,
      next: undefined,

      zombieParts: [],
      pitParts: [],

      loopCb: [],

      xCPoints: [],
      yCPoints: [],
      xPoints: [],
      yPoints: [],
      zPoints: [],
    };
  },

  components: {
    MenuComponent,
  },

  computed: {
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
  },

  methods: {
    updateRendererSize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        console.log("Resize call");

        const { container } = this.$refs;

        const containerRect = container.getBoundingClientRect();

        this.camera.aspect = containerRect.width / containerRect.height;
        this.camera.updateProjectionMatrix();

        if (this.controls) {
          this.controls.update();
        }

        this.renderer.setSize(containerRect.width, containerRect.height);

        this.updateCameraProjection();
      }, 10);

      return true;
    },

    updateCameraProjection() {
      const { camera, controls, pitWidth, pitHeight, pitDepth } = this;

      console.log(
        `Update camera projection call: ${pitWidth}-${pitHeight}-${pitDepth}`
      );

      const maxSize = Math.max(pitWidth, pitHeight, 0) + 1;
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

      console.log(`Load score ${lsScore} from localStorage`);

      // Update value
      this.lsScore = lsScore;

      return lsScore;
    },

    updateScore() {
      const { score } = this;

      console.log(`Update score ${score} in localStorage`);

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

    openMenu() {
      console.log("Open menu");
      this.isPause = true;
      this.isMenu = true;
    },

    closeMenu() {
      console.log("Close menu");
      this.isPause = false;
      this.isMenu = false;
    },

    changeSpeed(speed) {
      console.log(`Update speed to: ${speed}`);
      this.speed = parseInt(speed);
    },

    pauseCall() {
      console.log("Pause call");
      this.isPause = true;
    },

    playCall() {
      console.log("Play call");
      this.isPause = false;
    },

    updateSmooth(isSmooth) {
      this.isSmooth = isSmooth ? true : false;
      console.log(`Smooth updated: ${this.isSmooth}`);
    },

    updateInstanced(isInstanced) {
      this.isInstanced = isInstanced ? true : false;
      console.log(`Instanced updated: ${this.isInstanced}`);
      this.newGame();
    },

    updateSimple(isSimple) {
      this.isSimple = isSimple ? true : false;
      console.log(`Simple updated: ${this.isSimple}`);
      this.newGame();
    },

    updateControls(isControls) {
      this.isControls = isControls ? true : false;
      console.log(`Controls updated: ${this.isControls}`);
    },

    updateSound(sound) {
      this.sound = sound;
      console.log(`Update sound: ${sound}`);

      this.initAudio();
    },

    updateVolume(volume) {
      this.volume = volume;
      console.log(`Update volume: ${volume}`);

      if (this.bgSound) {
        this.bgSound.setVolume(volume);
      }
    },

    updateFxVolume(fxVolume) {
      this.fxVolume = fxVolume;
      console.log(`Update FX volume: ${fxVolume}`);

      if (this.dropSound) {
        this.dropSound.setVolume(fxVolume);
      }

      if (this.endSound) {
        this.endSound.setVolume(fxVolume);
      }

      if (this.clearSound) {
        this.clearSound.setVolume(fxVolume);
      }
    },

    updateBlocksType(blocksType) {
      this.blocksType = blocksType;
      console.log(`Update blocks type: ${blocksType}`);
    },

    newGame() {
      console.log("New game call");

      const { scene } = this;

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

      this.createElement();

      return true;
    },

    initLayer(z) {
      // console.log(`Init layer ${z}`);

      const { pitWidth, pitHeight } = this;

      this.layers[z] = [];
      this.layersElements[z] = new Array(pitWidth * pitHeight);

      for (let x = 0; x < pitWidth; x++) {
        this.layers[z][x] = [];

        for (let y = 0; y < pitHeight; y++) {
          this.layers[z][x][y] = 0;
        }
      }
    },

    initLayers() {
      const { pitWidth, pitHeight, pitDepth } = this;

      console.log(`Init layers: ${pitDepth}-${pitWidth}-${pitHeight}`);

      this.layers = [];
      this.layersElements = [];

      for (let z = 0; z < pitDepth; z++) {
        this.initLayer(z);
      }

      return true;
    },

    async initBgSound() {
      const { scene, sound, camera, volume } = this;

      // instantiate a listener
      const audioListener = new AudioListener();

      // add the listener to the camera
      camera.add(audioListener);

      // instantiate audio object
      const soundInstance = new Audio(audioListener);

      // add the audio object to the scene
      scene.add(soundInstance);

      const audioBuffer = await loadAudio(sound);

      soundInstance.setBuffer(audioBuffer);

      soundInstance.setLoop(true);
      soundInstance.setVolume(volume);

      // play the audio
      soundInstance.play();

      this.bgSound = soundInstance;
    },

    async initDropSound() {
      const { scene, camera, fxVolume } = this;

      const audioListener = new AudioListener();
      camera.add(audioListener);

      const soundInstance = new Audio(audioListener);
      scene.add(soundInstance);

      const audioBuffer = await loadAudio("fall.wav");

      soundInstance.setBuffer(audioBuffer);
      soundInstance.setVolume(fxVolume);

      this.dropSound = soundInstance;

      return soundInstance;
    },

    async initEndSound() {
      const { scene, camera, fxVolume } = this;

      const audioListener = new AudioListener();
      camera.add(audioListener);

      const soundInstance = new Audio(audioListener);
      scene.add(soundInstance);

      const audioBuffer = await loadAudio("zombieHoouw_1.mp3");

      soundInstance.setBuffer(audioBuffer);
      soundInstance.setVolume(fxVolume);

      this.endSound = soundInstance;

      return soundInstance;
    },

    async initClearSound() {
      const { scene, camera, fxVolume } = this;

      const audioListener = new AudioListener();
      camera.add(audioListener);

      const soundInstance = new Audio(audioListener);
      scene.add(soundInstance);

      const audioBuffer = await loadAudio("Zombie Sound.wav");

      soundInstance.setBuffer(audioBuffer);
      soundInstance.setVolume(fxVolume);

      this.clearSound = soundInstance;

      return soundInstance;
    },

    async initAudio() {
      const { scene, sound, camera, bgSound } = this;

      if (!scene || !camera || !sound) {
        return false;
      }

      // Update sound
      if (bgSound) {
        const audioBuffer = await loadAudio(sound);

        bgSound.stop();
        bgSound.setBuffer(audioBuffer);
        bgSound.play();

        return true;
      }

      await this.initBgSound();
      await this.initDropSound();
      await this.initEndSound();
      await this.initClearSound();

      return bgSound;
    },

    findElementIndexes(child) {
      const { xPoints, yPoints, zPoints, size } = this;

      const half = size / 2;

      const position = new Vector3(0, 0, 0);
      child.getWorldPosition(position);

      let { x, y, z } = position;

      x = Math.round(x * 100) / 100 + half;
      y = Math.round(y * 100) / 100 + half;
      z = Math.round(z * 100) / 100 - half;

      let xIndex = xPoints.indexOf(x) || -1;
      let yIndex = yPoints.indexOf(y) || -1;
      let zIndex = zPoints.indexOf(z) || -1;

      if (xIndex == -1) {
        xPoints.forEach((point, index, array) => {
          if (x >= point && x < array[index + 1]) {
            xIndex = index;
          }
        });
      }

      if (yIndex == -1) {
        yPoints.forEach((point, index, array) => {
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
        x: xIndex - 1,
        y: yIndex - 1,
        z: zIndex,
        pX: x,
        pY: y,
        pZ: z,
        uuid: child.uuid,
        el: child.clone(),
      };
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
              throw new Error(
                `Layer not found ${element.name}!(${x}-${y}-${z})(${pX.toFixed(
                  1
                )}-${pY.toFixed(1)}-${pZ.toFixed(
                  1
                )})(${child.position.x.toFixed(1)}-${child.position.y.toFixed(
                  1
                )}-${child.position.z.toFixed(1)})`
              );
            }

            const nextLayerValue = this.layers[z + 1][x][y];

            // console.log(
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
          throw new Error(
            `Index not found!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
          );
        }
      }

      return isFreeze;
    },

    drop() {
      this.dropElement(this.current);
    },

    dropElement(element) {
      console.log(`Drop element: ${element.name}`);

      element.userData.drop = true;

      const childs = element.getObjectByName("childs").children;

      const indexes = childs.map(this.findElementIndexes);

      const collisionPoints = [];

      for (const { x, y, z, uuid } of indexes) {
        for (let zIndex = 0; zIndex < this.zPoints.length; zIndex++) {
          if (this.layers[zIndex + 1] && this.layers[zIndex + 1][x][y]) {
            collisionPoints.push({ x, y, z, zIndex, uuid });
          }
        }
      }

      if (collisionPoints.length) {
        // console.log(`Found ${collisionPoints.length} collision points`);

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
      const color = this.colorPalette[layer];

      console.log(
        `Colorize element ${
          element.name
        } on layer ${layer}: ${color.getHexString()}`,
        `color: #${color.getHexString()}`
      );

      if (Array.isArray(element.material)) {
        element.material.forEach((material, index) => {
          // if (!material.name.includes("MainMat")) {
          //   return false;
          // }

          const newMaterial = material.clone();
          newMaterial.map = newMaterial.map.clone();
          newMaterial.map.repeat.set(2, 2);
          newMaterial.map.offset.set(0.5, 0);
          newMaterial.map.needsUpdate = true;
          newMaterial.color = color;

          element.material[index] = newMaterial;
        });
      } else {
        let newMaterial;

        if (element.material.isMeshNormalMaterial) {
          newMaterial = new MeshBasicMaterial({ color });
        } else {
          newMaterial = element.material.clone();
          newMaterial.map = newMaterial.map.clone();
          newMaterial.map.repeat.set(2, 2);
          newMaterial.map.offset.set(0.5, 0);
          newMaterial.map.needsUpdate = true;
          newMaterial.color = color;
        }

        element.material = newMaterial;
      }

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

        console.log(`Process layer delete: ${index}`);

        filledLevelsCounter++;

        // Update speed level
        this.speed += this.speedStep;

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

        console.log(`Levels ${filledLevelsCounter} score: ${scoreDiff}`);

        this.score += scoreDiff;
      }

      return true;
    },

    petrify(element) {
      console.log(
        `Petrify element: ${element.name}(${element.position.x.toFixed(
          1
        )}-${element.position.y.toFixed(1)}-${element.position.z.toFixed(1)})`
      );

      const childs = element.getObjectByName("childs").children;

      const indexes = childs.map(this.findElementIndexes);

      for (const { x, y, z, pX, pY, pZ, el } of indexes) {
        if (z != -1 && x != -1 && y != -1) {
          if (
            this.layers[z] == undefined ||
            this.layers[z][x] == undefined ||
            this.layers[z][x][y] == undefined
          ) {
            throw new Error(
              `Element not found in layers!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
            );
          }

          if (this.layers[z][x][y] && !element.userData.drop) {
            this.score += indexes.length;

            this.updateScore();

            console.log(
              `Element already petrified!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
            );
            this.isEnd = true;
            this.openMenu();

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

          this.score++;

          this.setLayerPoint(x, y, z);

          el.position.set(pX - this.size / 2, pY - this.size / 2, pZ);
          el.userData.static = true;

          this.colorizeElement(el, z);

          this.layersElements[z].push(el);
          this.scene.add(el);

          if (this.dropSound && this.dropSound.isPlaying) {
            this.dropSound.stop();
          }

          if (this.dropSound) {
            this.dropSound.play();
          }
        } else {
          throw new Error(
            `Index not found!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
          );
        }
      }

      // Remove element after process layers
      this.scene.remove(element);

      // Check layers
      this.layersCheck();

      // console.log(
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
      //   console.log("Move to X point");
      //   element.translateX((sizeBefore.x - sizeX) / 2);
      // }

      // if (sizeBefore.y != sizeY) {
      //   console.log("Move to Y point");
      //   element.translateY((sizeBefore.y - sizeY) / 2);
      // }

      // console.log(
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
        // console.log("x before", xPosition);

        xPoints.forEach((point, index, array) => {
          if (xPosition > point && xPosition < array[index + 1]) {
            this.translateHelper(element, "x", point - xPosition);
          }
        });

        // console.log("x after", element.position.x);
      }

      if (!yPoints.includes(yPosition)) {
        // console.log("y before", yPosition);

        yPoints.forEach((point, index, array) => {
          if (yPosition > point && yPosition < array[index + 1]) {
            this.translateHelper(element, "y", point - yPosition);
          }
        });

        // console.log("y after", element.position.y);
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
      //   console.log(`X: ${position.x} -> ${newPosition.x}`);
      // }

      // if (newPosition.y != position.y) {
      //   console.log(`Y: ${position.y} -> ${newPosition.y}`);
      // }

      // if (newPosition.z != position.z) {
      //   console.log(`Z: ${position.z} -> ${newPosition.z}`);
      // }

      return element;
    },

    changePitSize(pitSize) {
      const { scene, renderer, size } = this;

      this.pitSize = pitSize;

      const [width, height, depth] = pitSize.split("x");

      console.log(`Change pit size to ${pitSize}`);

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

      this.createElement();

      return true;
    },

    async loadZombie() {
      const zombie = await loadZombie();
      const pitParts = await loadPitParts();

      if (!zombie || !pitParts) {
        this.isSimple = true;
        return false;
      }

      for (const child of pitParts.children) {
        this.pitParts.push(child);

        if (Array.isArray(child.material)) {
          child.material.forEach((item, index, array) => {
            item.shininess = 0;
            item.specular = new Color(0x000000);
            item.flatShading = true;
          });
        } else {
          child.material.shininess = 0;
          child.material.specular = new Color(0x000000);
          child.material.flatShading = true;
        }
      }

      // Save all parts
      for (const child of zombie.children) {
        this.zombieParts.push(child);

        if (Array.isArray(child.material)) {
          child.material.forEach((item, index, array) => {
            item.shininess = 0;
            item.specular = new Color(0x000000);
            item.flatShading = true;
          });
        } else {
          child.material.shininess = 0;
          child.material.specular = new Color(0x000000);
          child.material.flatShading = true;
        }
      }

      return true;
    },

    updatePreview() {
      // console.log("Update preview call");

      const { next, pitWidth, pitHeight, camera, size } = this;

      if (next) {
        if (camera.aspect > 1) {
          next.position.set(
            pitWidth / 2 + size / 2,
            pitHeight / 2 - size / 2,
            1.1 * next.userData.size.z + size / 2
          );
        } else {
          next.position.set(
            0,
            -pitHeight / 2 - size / 2,
            1.1 * next.userData.size.z + size / 2
          );
        }
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

    getRandomForm() {
      // console.log("Get random form call");

      const { size, isSimple, zombieParts, blocksType } = this;

      const formFunctions = [
        generateP0Form,
        generateP1Form,
        generateP2Form,
        generateP5Form,
        generateP6Form,
        generateP7Form,
        generateP8Form,
        generateP9Form,
      ];

      if (blocksType == "basic" || blocksType == "extended") {
        formFunctions.push(
          ...[generateP32Form, generateP33Form, generateP34Form]
        );
      }

      if (blocksType == "extended") {
        formFunctions.push(
          ...[
            generateP3Form,
            generateP4Form,

            generateP10Form,
            generateP11Form,
            generateP12Form,
            generateP13Form,
            generateP14Form,
            generateP15Form,
            generateP16Form,
            generateP17Form,
            generateP18Form,
            generateP19Form,

            generateP20Form,
            generateP21Form,
            generateP22Form,
            generateP23Form,
            generateP24Form,
            generateP25Form,
            generateP26Form,
            generateP27Form,
            generateP28Form,
            generateP29Form,

            generateP30Form,
            generateP31Form,

            generateP35Form,
            generateP36Form,
            generateP37Form,
            generateP38Form,
            generateP39Form,
            generateP40Form,
          ]
        );
      }

      const formFunction =
        formFunctions[Math.floor(Math.random() * formFunctions.length)];

      // Create element
      const element = formFunction(size, zombieParts, isSimple);

      this.restrainElement(element);

      // console.log(
      //   `Created ${element.name}(${element.position.x.toFixed(
      //     1
      //   )}-${element.position.y.toFixed(1)}-${element.position.z.toFixed(1)})`
      // );

      return element;
    },

    async initLights() {
      const { scene, camera, pitWidth } = this;

      const gltf = await loadLights();

      const light = new AmbientLight(0xffffff, 0.02);
      scene.add(light);

      const cameraLight = new AmbientLight(0xffffff, 0.08);
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
      switch (event.code) {
        case "KeyQ":
          // console.log("Press Q");
          this.rotateZMinus();
          break;
        case "KeyE":
          // console.log("Press E");
          this.rotateZPlus();
          break;
        case "KeyW":
          // console.log("Press W");
          this.rotateXPlus();
          break;
        case "KeyS":
          // console.log("Press S");
          this.rotateXMinus();
          break;
        case "KeyA":
          // console.log("Press A");
          this.rotateYMinus();
          break;
        case "KeyD":
          // console.log("Press D");
          this.rotateYPlus();
          break;
        case "ArrowUp":
          // console.log("Press Up");
          this.moveUp();
          break;
        case "ArrowDown":
          // console.log("Press Down");
          this.moveDown();
          break;
        case "ArrowLeft":
          // console.log("Press Left");
          this.moveLeft();
          break;
        case "ArrowRight":
          // console.log("Press Right");
          this.moveRight();
          break;
        case "Space":
          // console.log("Press Space");
          // this.isPause = !this.isPause;

          this.current.userData.drop = true;
          break;
        case "Escape":
          // console.log("Press Escape");

          if (this.isMenu) {
            this.closeMenu();
          } else {
            this.openMenu();
          }
          break;
      }
    },

    clickListener() {
      if (this.bgSound) {
        this.bgSound.play();
      }
    },

    parseURLSearchParams() {
      console.log("Parse URLSearchParams");

      const params = new URLSearchParams(window.location.search);

      if (params.has("orbit") && params.get("orbit") == "true") {
        this.orbitControls = true;
      }

      if (params.has("helpers") && params.get("helpers") == "true") {
        this.helpers = true;
      }

      return false;
    },
  },

  async mounted() {
    this.loadScore();
    this.parseURLSearchParams();

    await this.loadZombie();
    this.init();

    window.addEventListener("resize", this.updateRendererSize);
    document.addEventListener("keyup", this.keyupHandler);
    window.addEventListener("click", this.clickListener);
  },

  unmounted() {
    window.removeEventListener("resize", this.updateRendererSize);
    document.removeEventListener("keyup", this.keyupHandler);
    window.removeEventListener("click", this.clickListener);
  },
};
