import {
  AmbientLight,
  Clock,
  Color,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { loadPitParts, loadZombie } from "../../helpers/load-zombie.js";
import generateFourPoints from "../../helpers/generate-four-points.js";
import generateLForm from "../../helpers/generate-l-form.js";
import generateOnePoint from "../../helpers/generate-one-point.js";
import generatePit from "../../helpers/generate-pit.js";
import generateSForm from "../../helpers/generate-s-form.js";
import generateTForm from "../../helpers/generate-t-form.js";
import generateThreePoints from "../../helpers/generate-three-points.js";
import generateThreePointsCurve from "../../helpers/generate-three-points-curve.js";
import generateTwoPoints from "../../helpers/generate-two-points.js";
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

      pitWidth: 5,
      pitHeight: 5,
      pitDepth: 12,

      layers: new Array(12),
      layersElements: new Array(12),
      elements: [],
      colorPalette,

      delta: 0,
      timeDelta: 0,
      second: 0,

      fov: 70,

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

      camera: undefined,
      scene: undefined,
      renderer: undefined,
      controls: undefined,
      pit: undefined,

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
      const { camera, controls, pitWidth, pitHeight, pitDepth, next } = this;

      console.log(
        `Update camera projection call: ${pitWidth}-${pitHeight}-${pitDepth}`
      );

      const maxSize = Math.max(pitWidth, pitHeight, 0);
      const fitHeightDistance =
        maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = 2 * Math.max(fitHeightDistance, fitWidthDistance);

      camera.position.setZ(distance - maxSize);

      if (next) {
        if (camera.aspect > 1) {
          next.position.set(pitWidth / 2 + 0.5, pitHeight / 2 - 0.5, 0);
        } else {
          next.position.set(0, -pitHeight / 2 - 0.5, 0);
        }
      }

      if (controls) {
        controls.update();
      }

      return true;
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

    updateSimple(isSimple) {
      this.isSimple = isSimple ? true : false;
      console.log(`Simple updated: ${this.isSimple}`);
      this.newGame();
    },

    updateControls(isControls) {
      this.isControls = isControls ? true : false;
      console.log(`Controls updated: ${this.isControls}`);
    },

    newGame() {
      console.log("New game call");

      this.isEnd = false;
      this.changePitSize(this.pitSize);

      return true;
    },

    initLayer(z) {
      console.log(`Init layer ${z}`);

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

      for (const [index, zLayer] of layers.entries()) {
        const layerValues = zLayer.reduce((prev, current) => {
          prev.push(...current);

          return prev;
        }, []);

        if (layerValues.includes(0)) {
          continue;
        }

        console.log(`Process layer delete: ${index}`);

        // Update score
        this.score += 100;

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
            console.log(
              `Element already petrified!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
            );
            this.isEnd = true;
            this.openMenu();
            return false;
          }

          this.setLayerPoint(x, y, z);

          el.position.set(pX - this.size / 2, pY - this.size / 2, pZ);
          el.userData.static = true;

          this.colorizeElement(el, z);

          this.layersElements[z].push(el);
          this.scene.add(el);
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

    restrainElement(element) {
      const { pitWidth, pitHeight, pitDepth, xPoints, yPoints } = this;

      element.updateMatrixWorld();

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
        });
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
        this.isSimple
      );
      scene.add(this.pit);

      this.updateCameraProjection();

      // Init layers after resize
      this.initLayers();
      this.initPoints();

      this.createElement();

      return true;
    },

    async loadZombie() {
      const zombie = await loadZombie();
      const pitParts = await loadPitParts();

      // await loadTestCube();

      if (!zombie) {
        return false;
      }

      for (const child of pitParts.children) {
        this.pitParts.push(child);
      }

      // Save all parts
      for (const child of zombie.children) {
        this.zombieParts.push(child);
      }

      // console.log(this.zombieParts.map((item) => item.name).sort());

      // zombie.userData.name = "Zombie";

      // zombie.position.setZ(-5);
      // zombie.position.setY(-1);

      // if (this.scene) {
      //   this.scene.add(zombie);
      // }
    },

    updatePreview() {
      // console.log("Update preview call");

      this.updateCameraProjection();

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
      const bottom = pitHeight / 2 - element.userData.size.y / 2;

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

      const { size, isSimple, zombieParts } = this;

      const formFunctions = [
        generateFourPoints,
        generateLForm,
        generateOnePoint,
        generateSForm,
        generateTForm,
        generateThreePoints,
        generateThreePointsCurve,
        generateTwoPoints,
      ];

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
        this.isSimple
      );
      scene.add(pit);
      this.pit = pit;

      // Init layers
      this.initLayers();
      this.initPoints();

      const light = new AmbientLight(this.lightColor); //  white light
      scene.add(light);

      // Init test mode
      // initTest.call(this);

      // init waterfall mode
      initWaterfall.call(this);

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

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.maxZoom = 10;
      controls.maxDistance = 50;
      this.controls = controls;

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
  },

  async mounted() {
    await this.loadZombie();
    this.init();

    window.addEventListener("resize", this.updateRendererSize);
    document.addEventListener("keyup", this.keyupHandler);
  },

  unmounted() {
    window.removeEventListener("resize", this.updateRendererSize);
    document.removeEventListener("keyup", this.keyupHandler);
  },
};
