import {
  AmbientLight,
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
} from "three";

import generateFourPoints from "../../helpers/generate-four-points.js";
import generateLForm from "../../helpers/generate-l-form.js";
import generateOnePoint from "../../helpers/generate-one-point.js";
import generatePit from "../../helpers/generate-pit.js";
import generateSForm from "../../helpers/generate-s-form.js";
import generateTForm from "../../helpers/generate-t-form.js";
import generateThreePoints from "../../helpers/generate-three-points.js";
import generateThreePointsCurve from "../../helpers/generate-three-points-curve.js";
import generateTwoPoints from "../../helpers/generate-two-points.js";
import loadZombie from "../../helpers/load-zombie.js";

import MenuComponent from "../MenuComponent/MenuComponent.vue";

export default {
  name: "MainScreen",

  data() {
    return {
      size: 0.4,
      speed: 1,

      pitWidth: 5,
      pitHeight: 5,
      pitDepth: 12,

      pitSize: "5x5x12",

      gridColor: 0x80_80_80,

      lightColor: 0xfa_fa_fa,

      isPause: false,

      camera: undefined,
      scene: undefined,
      renderer: undefined,
      pit: undefined,

      resizeTimeout: undefined,
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

        this.renderer.setSize(containerRect.width, containerRect.height);
      }, 10);
    },

    closeMenu() {
      console.log("Close menu");
      this.isPause = false;
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

      return true;
    },

    async loadZombie() {
      const zombie = await loadZombie();

      if (!zombie) {
        return false;
      }

      zombie.userData.name = "Zombie";

      zombie.position.setZ(-5);
      zombie.position.setY(-1);

      if (this.scene) {
        this.scene.add(zombie);
      }
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

      return true;
    },

    init() {
      const { container } = this.$refs;

      const width = 800;
      const height = 600;

      const clock = new Clock();

      const camera = new PerspectiveCamera(110, width / height, 0.01, 100);
      camera.position.z = 2;
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
      this.initTest();

      // animation

      let timeDelta = 0;
      let prevTime = undefined;
      let count = -4;

      const animation = (time) => {
        const delta = clock.getDelta();

        if (this.isPause) {
          return false;
        }

        timeDelta += delta;

        const second = Math.round(timeDelta) * this.speed;

        // let changePosition = false;

        // if (second != prevTime) {
        //   prevTime = second;

        //   if (count > 3) {
        //     count = -4;
        //   }

        //   changePosition = true;

        //   count += 1;
        // }

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

        renderer.render(scene, camera);
      };

      const renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setAnimationLoop(animation);
      container.appendChild(renderer.domElement);
      this.renderer = renderer;

      this.updateRendererSize();
    },

    keyupHandler(event) {
      const xAxis = new Vector3(1, 0, 0);
      const yAxis = new Vector3(0, 1, 0);
      const zAxis = new Vector3(0, 0, 1);

      switch (event.code) {
        case "KeyQ":
          console.log("Press Q");
          this.zombie.rotateOnWorldAxis(zAxis, -Math.PI / 2);
          break;
        case "KeyE":
          console.log("Press E");
          this.zombie.rotateOnWorldAxis(zAxis, Math.PI / 2);
          break;
        case "KeyW":
          console.log("Press W");
          this.zombie.rotateOnWorldAxis(xAxis, Math.PI / 2);
          break;
        case "KeyS":
          console.log("Press S");
          this.zombie.rotateOnWorldAxis(xAxis, -Math.PI / 2);
          break;
        case "KeyA":
          console.log("Press A");
          this.zombie.rotateOnWorldAxis(yAxis, -Math.PI / 2);
          break;
        case "KeyD":
          console.log("Press D");
          this.zombie.rotateOnWorldAxis(yAxis, Math.PI / 2);
          break;
        case "ArrowUp":
          console.log("Press Up");
          this.zombie.position.setY(this.zombie.position.y + 1);
          break;
        case "ArrowDown":
          console.log("Press Down");
          this.zombie.position.setY(this.zombie.position.y - 1);
          break;
        case "ArrowLeft":
          console.log("Press Left");
          this.zombie.position.setX(this.zombie.position.x - 1);
          break;
        case "ArrowRight":
          console.log("Press Right");
          this.zombie.position.setX(this.zombie.position.x + 1);
          break;
        case "Space":
          console.log("Press Space");
          break;
        case "Escape":
          console.log("Press Escape");
          this.isPause = !this.isPause;
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
