import {
  AmbientLight,
  Clock,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  MathUtils,
} from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import generateFourPoints from "../../helpers/generate-four-points.js";
import generateLForm from "../../helpers/generate-l-form.js";
import generateOnePoint from "../../helpers/generate-one-point.js";
import generatePit from "../../helpers/generate-pit.js";
import generateSForm from "../../helpers/generate-s-form.js";
import generateTForm from "../../helpers/generate-t-form.js";
import generateThreePoints from "../../helpers/generate-three-points.js";
import generateThreePointsCurve from "../../helpers/generate-three-points-curve.js";
import generateTwoPoints from "../../helpers/generate-two-points.js";
import getGroupSize from "../../helpers/get-group-size.js";
import loadZombie from "../../helpers/load-zombie.js";
import randomBetween from "../../helpers/random-between.js";

import MenuComponent from "../MenuComponent/MenuComponent.vue";

// Define axis for rotates
const xAxis = new Vector3(1, 0, 0).normalize();
const yAxis = new Vector3(0, 1, 0).normalize();
const zAxis = new Vector3(0, 0, 1).normalize();

export default {
  name: "MainScreen",

  data() {
    return {
      size: 1,
      speed: 1,

      pitWidth: 5,
      pitHeight: 5,
      pitDepth: 12,

      fov: 70,

      pitSize: "5x5x12",

      gridColor: 0x80_80_80,

      lightColor: 0xfa_fa_fa,

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

    xPoints() {
      const { pitWidth } = this;

      const points = [];

      const firstPoint = -pitWidth / 2;

      for (let i = 0; i <= pitWidth; i++) {
        points.push(firstPoint + i);
      }

      return points;
    },

    yPoints() {
      const { pitHeight } = this;

      const points = [];

      const firstPoint = -pitHeight / 2;

      for (let i = 0; i <= pitHeight; i++) {
        points.push(firstPoint + i);
      }

      return points;
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

        this.controls.update();

        this.renderer.setSize(containerRect.width, containerRect.height);

        this.updateCameraProjection();
      }, 10);
    },

    updateCameraProjection() {
      console.log("Update camera projection call");

      const { camera, controls, pitWidth, pitHeight } = this;

      const maxSize = Math.max(pitWidth, pitHeight, 0);
      const fitHeightDistance =
        maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = 2 * Math.max(fitHeightDistance, fitWidthDistance);

      camera.position.setZ(distance - maxSize);

      controls.update();
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

    rotateHelper(axisType = "x", angle = 90, element) {
      const angleValue = MathUtils.degToRad(angle);

      if (!element) {
        element = this.current;
      }

      let axis = xAxis;

      switch (axisType) {
        case "x":
          axis = xAxis;
          break;
        case "y":
          axis = yAxis;
          break;
        case "z":
          axis = zAxis;
          break;

        default:
          axis = xAxis;
          break;
      }

      element.getObjectByName("childs").rotateOnWorldAxis(axis, angleValue);

      this.restrainElement(element);
    },

    moveLeft() {
      this.scene.remove(this.current);
      this.current.translateX(-1);
      this.scene.add(this.current);
      this.restrainElement(this.current);
    },

    moveRight() {
      this.scene.remove(this.current);
      this.current.translateX(1);
      this.scene.add(this.current);
      this.restrainElement(this.current);
    },

    moveUp() {
      this.scene.remove(this.current);
      this.current.translateY(1);
      this.scene.add(this.current);
      this.restrainElement(this.current);
    },

    moveDown() {
      this.scene.remove(this.current);
      this.current.translateY(-1);
      this.scene.add(this.current);
      this.restrainElement(this.current);
    },

    restrainElement(element) {
      const { pitWidth, pitHeight, pitDepth, xPoints, yPoints } = this;

      element.updateMatrixWorld();

      const position = new Vector3();
      element.getWorldPosition(position);

      const sizeBefore = element.userData.size;

      element.userData.size = getGroupSize(element);

      const { x: sizeX, y: sizeY, z: sizeZ } = element.userData;

      if (sizeBefore.x != sizeX && sizeBefore.x < sizeX) {
        element.translateX((sizeBefore.x - sizeX) / 2);
      }

      if (sizeBefore.y != sizeY && sizeBefore.y < sizeY) {
        element.translateY((sizeBefore.y - sizeY) / 2);
      }

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
            element.translateX(point - xPosition);
          }
        });

        // console.log("x after", element.position.x);
      }

      if (!yPoints.includes(yPosition)) {
        // console.log("y before", yPosition);

        yPoints.forEach((point, index, array) => {
          if (yPosition > point && yPosition < array[index + 1]) {
            element.translateY(point - yPosition);
          }
        });

        // console.log("y after", element.position.y);
      }

      // Restrain position
      if (position.x <= -pitWidth / 2) {
        element.position.x = -pitWidth / 2;
      }

      if (position.x >= pitWidth / 2) {
        element.position.x = pitWidth / 2;
      }

      if (position.y <= -pitHeight / 2) {
        element.position.y = -pitHeight / 2;
      }

      if (position.y >= pitHeight / 2) {
        element.position.y = pitHeight / 2;
      }

      if (position.z <= -pitDepth + sizeZ / 2) {
        element.position.z = -pitDepth + sizeZ / 2;
      }

      if (position.z >= -sizeZ / 2) {
        element.position.z = -sizeZ / 2;
      }

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

      return true;
    },

    async loadZombie() {
      const zombie = await loadZombie();

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
      console.log("Update preview call");
    },

    getRandomForm() {
      console.log("Get random form call");

      const { pitWidth, pitHeight } = this;

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

      let cornerType = randomBetween(1, 4);

      while (cornerType == this.prevCorner) {
        cornerType = randomBetween(1, 4);
      }

      this.prevCorner = cornerType;

      // Create element
      const element = formFunction(this.size, this.zombieParts);

      // const offset = randomBetween(-2, 2);
      const offset = 0;

      const left = element.userData.size.x / 2 - pitWidth / 2;
      const right = -element.userData.size.x / 2 + pitWidth / 2;

      const top = -element.userData.size.y / 2 + pitHeight / 2;
      const bottom = element.userData.size.y / 2 - pitHeight / 2;

      switch (cornerType) {
        // Top Left
        case 1:
          element.position.setX(left + offset);
          element.position.setY(top + offset);
          break;
        // Top Right
        case 2:
          element.position.setX(right + offset);
          element.position.setY(top + offset);
          break;
        // Bottom Left
        case 3:
          element.position.setX(left + offset);
          element.position.setY(bottom + offset);
          break;
        // Bottom Right
        case 4:
          element.position.setX(right + offset);
          element.position.setY(bottom + offset);
          break;
      }

      this.restrainElement(element);

      return element;
    },

    initWaterfall() {
      console.log("Init waterfall");

      const { scene } = this;

      let prevCount = undefined;

      let elements = [];

      this.loopCb.push((delta, timeDelta, second) => {
        const time = this.isSmooth ? timeDelta : second;

        if (this.isPause) {
          elements.forEach((element) => {
            if (!element.userData.timeDiff) {
              element.userData.timeDiff = time - element.userData.time;
            }

            element.userData.time = time - element.userData.timeDiff;
          });

          prevCount = Math.round(time / 2);

          return false;
        }

        elements.forEach((element, index, array) => {
          if (!element) {
            return false;
          }

          element.userData.timeDiff = undefined;

          const elTime = element.userData.time;
          const rotateTime = element.userData.rotate || 0;
          const elSize = element.userData.size;

          element.position.setZ(-(time - elTime) * this.speed - elSize.z / 2);

          // console.log(`${index}: ${element.position.z.toFixed(2)}`);

          if (element.position.z < -this.pitDepth + elSize.z / 2) {
            scene.remove(element);
            array[index] = undefined;
            return false;
          }

          // Try to random rotate every second
          if (!(Math.random() > 0.5 && Date.now() - rotateTime > 1000)) {
            element.userData.rotate = Date.now();
            return false;
          }

          // console.log("Rotate call");

          const axis = randomBetween(0, 2);

          this.rotateHelper(
            ["x", "y", "z"][axis],
            Math.random() > 0.5 ? 90 : -90,
            element
          );

          element.userData.rotate = Date.now();
        });

        elements = elements.filter((item) => item);

        const count = Math.round(time / 2);

        if (prevCount == count) {
          return false;
        }

        prevCount = count;

        const element = this.next ? this.next : this.getRandomForm();

        element.userData.time = time;

        // set start position on Z axis
        element.position.setZ(-element.userData.size.z / 2);

        elements.push(element);
        scene.add(element);

        this.current = element;
        this.next = this.getRandomForm();

        this.updatePreview();
      });
    },

    initTest() {
      console.log("Init test");

      const { scene, size } = this;

      const onePoint = generateOnePoint(size);
      const twoPoints = generateTwoPoints(size);
      const threePoints = generateThreePoints(size);
      const fourPoints = generateFourPoints(size);
      const lForm = generateLForm(size);
      const tForm = generateTForm(size);
      const sForm = generateSForm(size);
      const threePointsCurve = generateThreePointsCurve(size);

      // Set Test name
      [
        onePoint,
        twoPoints,
        threePoints,
        fourPoints,
        lForm,
        tForm,
        sForm,
        threePointsCurve,
      ].forEach((group) => (group.userData.name = "Test"));

      const zPosition = -2;

      onePoint.position.set(0, 0, zPosition);
      twoPoints.position.set(-2, 0, zPosition);
      threePoints.position.set(2, 0, zPosition);

      fourPoints.position.set(2, 2, zPosition);
      lForm.position.set(0, 2, zPosition);
      tForm.position.set(-2, 2, zPosition);

      sForm.position.set(-2, -2, zPosition);
      threePointsCurve.position.set(0, -2, zPosition);

      scene.add(onePoint);
      scene.add(twoPoints);
      scene.add(threePoints);
      scene.add(fourPoints);
      scene.add(lForm);
      scene.add(tForm);
      scene.add(sForm);
      scene.add(threePointsCurve);

      this.loopCb.push((delta, timeDelta) => {
        // Rotate test items
        scene.children
          .filter((item) => item.userData.name && item.userData.name == "Test")
          .forEach((group) => {
            group.rotation.x = timeDelta / 2;
            group.rotation.y = timeDelta / 1;
            group.rotation.z = timeDelta / 3;

            // if (changePosition) {
            //   group.position.setZ(-count);
            // }
          });
      });

      return true;
    },

    init() {
      const { container } = this.$refs;

      const width = 800;
      const height = 600;

      const clock = new Clock();

      const camera = new PerspectiveCamera(this.fov, width / height, 0.01, 100);
      this.camera = camera;

      const scene = new Scene();
      this.scene = scene;

      const pit = generatePit(
        this.pitWidth,
        this.pitHeight,
        this.pitDepth,
        this.gridColor
      );
      scene.add(pit);
      this.pit = pit;

      const light = new AmbientLight(this.lightColor); //  white light
      scene.add(light);

      // Init test mode
      // this.initTest();

      // init waterfall mode
      this.initWaterfall();

      // animation

      let timeDelta = 0;

      const animation = (time) => {
        const delta = clock.getDelta();

        if (!this.isPause) {
          timeDelta += delta;
        }

        const second = Math.round(timeDelta) * this.speed;

        if (Array.isArray(this.loopCb) && this.loopCb.length) {
          this.loopCb.forEach((fn) => fn(delta, timeDelta, second));
        }

        controls.update();

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
          console.log("Press Q");
          this.rotateHelper("z", -90);
          break;
        case "KeyE":
          console.log("Press E");
          this.rotateHelper("z", 90);
          break;
        case "KeyW":
          console.log("Press W");
          this.rotateHelper("x", 90);
          break;
        case "KeyS":
          console.log("Press S");
          this.rotateHelper("x", -90);
          break;
        case "KeyA":
          console.log("Press A");
          this.rotateHelper("y", -90);
          break;
        case "KeyD":
          console.log("Press D");
          this.rotateHelper("y", 90);
          break;
        case "ArrowUp":
          console.log("Press Up");
          this.moveUp();
          break;
        case "ArrowDown":
          console.log("Press Down");
          this.moveDown();
          break;
        case "ArrowLeft":
          console.log("Press Left");
          this.moveLeft();
          break;
        case "ArrowRight":
          console.log("Press Right");
          this.moveRight();
          break;
        case "Space":
          console.log("Press Space");
          this.isPause = !this.isPause;
          break;
        case "Escape":
          console.log("Press Escape");

          if (this.isMenu) {
            this.closeMenu();
          } else {
            this.openMenu();
          }
          break;
      }
    },
  },

  beforeMount() {
    this.loadZombie();
  },

  mounted() {
    this.init();

    window.addEventListener("resize", this.updateRendererSize);
    document.addEventListener("keyup", this.keyupHandler);
  },

  unmounted() {
    window.removeEventListener("resize", this.updateRendererSize);
    document.removeEventListener("keyup", this.keyupHandler);
  },
};
