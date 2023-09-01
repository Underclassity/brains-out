import {
  AmbientLight,
  Clock,
  Color,
  Group,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { loadZombie } from "../../helpers/load-zombie.js";
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

import { moveDown, moveLeft, moveRight, moveUp } from "./move.js";
import {
  positionHelper,
  rotateHelper,
  translateHelper,
  setLayerPoint,
} from "./transform-helpers.js";
import { initWaterfall, createElement } from "./waterfall.js";
import initPoints from "./init-points.js";
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

      pitWidth: 5,
      pitHeight: 5,
      pitDepth: 12,

      layers: new Array(12),
      elements: [],

      delta: 0,
      timeDelta: 0,
      second: 0,

      fov: 70,

      pitSize: "5x5x12",

      gridColor: 0x80_80_80,
      lightColor: 0xfa_fa_fa,
      sceneColor: 0x00_0b_12,

      isPause: true,
      isMenu: true,
      isSmooth: true,

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
      console.log("Update camera projection call");

      const { camera, controls, pitWidth, pitHeight, next } = this;

      const maxSize = Math.max(pitWidth + 1, pitHeight, 0);
      const fitHeightDistance =
        maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = 2 * Math.max(fitHeightDistance, fitWidthDistance);

      camera.position.setZ(distance - maxSize);

      if (next) {
        next.position.set(pitWidth / 2 + 0.5, pitHeight / 2 - 0.5, 0);
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

    initLayers() {
      const { pitWidth, pitHeight, pitDepth } = this;

      console.log(`Init layers: ${pitDepth}-${pitWidth}-${pitHeight}`);

      this.layers = [];

      for (let z = 0; z < pitDepth; z++) {
        this.layers[z] = [];
        for (let x = 0; x < pitWidth; x++) {
          this.layers[z][x] = [];

          for (let y = 0; y < pitHeight; y++) {
            this.layers[z][x][y] = 0;
          }
        }
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

    dropElement(element) {
      console.log(`Drop element: ${element.name}`);

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

    petrify(element) {
      console.log(
        `Petrify element: ${element.name}(${element.position.x.toFixed(
          1
        )}-${element.position.y.toFixed(1)}-${element.position.z.toFixed(1)})`
      );

      const childs = element.getObjectByName("childs").children;

      const indexes = childs.map(this.findElementIndexes);

      for (const { x, y, z, pX, pY, pZ } of indexes) {
        if (z != -1 && x != -1 && y != -1) {
          if (this.layers[z][x][y] && !element.userData.drop) {
            throw new Error(
              `Element already petrified!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
            );
          }

          this.setLayerPoint(x, y, z);
        } else {
          throw new Error(
            `Index not found!(${x}-${y}-${z})(${pX}-${pY}-${pZ})`
          );
        }
      }

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
      const { scene, renderer } = this;

      this.pitSize = pitSize;

      const [width, height, depth] = pitSize.split("x");

      console.log(`Change pit size to ${pitSize}`);

      this.pitWidth = width;
      this.pitHeight = height;
      this.pitDepth = depth;

      scene.remove(this.pit);

      renderer.renderLists.dispose();

      this.pit = generatePit(width, height, depth, this.gridColor);
      scene.add(this.pit);

      this.updateCameraProjection();

      // Init layers after resize
      this.initLayers();
      this.initPoints();

      return true;
    },

    async loadZombie() {
      const zombie = await loadZombie();

      // await loadTestCube();

      if (!zombie) {
        return false;
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

    getRandomForm() {
      // console.log("Get random form call");

      const { pitWidth, pitHeight, size, zombieParts } = this;

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

      let cornerType = randomBetween(1, 5);

      while (cornerType == this.prevCorner) {
        cornerType = randomBetween(1, 5);
      }

      this.prevCorner = cornerType;

      // Create element
      const element = formFunction(size, zombieParts);

      const offset = randomBetween(-2, 2);

      const left = element.userData.size.x / 2 - pitWidth / 2;
      const right = -element.userData.size.x / 2 + pitWidth / 2;

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
        this.gridColor
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
      renderer.setAnimationLoop(animation);
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
          this.rotateHelper(this.current, "z", -90);
          break;
        case "KeyE":
          // console.log("Press E");
          this.rotateHelper(this.current, "z", 90);
          break;
        case "KeyW":
          // console.log("Press W");
          this.rotateHelper(this.current, "x", 90);
          break;
        case "KeyS":
          // console.log("Press S");
          this.rotateHelper(this.current, "x", -90);
          break;
        case "KeyA":
          // console.log("Press A");
          this.rotateHelper(this.current, "y", -90);
          break;
        case "KeyD":
          // console.log("Press D");
          this.rotateHelper(this.current, "y", 90);
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
