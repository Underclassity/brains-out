import * as THREE from "three";

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

export default {
  name: "MainScreen",

  data() {
    return {
      size: 0.2,
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
    };
  },

  computed: {
    zombie() {
      const { scene } = this;

      return scene.children.find((item) => item.userData.name == "Zombie");
    },
  },

  methods: {
    updateRendererSize() {
      console.log("Resize call");

      const { container } = this.$refs;

      const containerRect = container.getBoundingClientRect();

      this.camera.aspect = containerRect.width / containerRect.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(containerRect.width, containerRect.height);
    },

    changePitSize() {
      const { pitSize, scene, renderer } = this;

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
      const { scene } = this;

      const onePoint = generateOnePoint();
      const twoPoints = generateTwoPoints();
      const threePoints = generateThreePoints();
      const fourPoints = generateFourPoints();
      const lForm = generateLForm();
      const tForm = generateTForm();
      const sForm = generateSForm();
      const threePointsCurve = generateThreePointsCurve();

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

      onePoint.position.set(0, 0, 0);
      twoPoints.position.set(-1, 0, 0);
      threePoints.position.set(1, 0, 0);

      fourPoints.position.set(1, 1, 0);
      lForm.position.set(0, 1, 0);
      tForm.position.set(-1, 1, 0);

      sForm.position.set(-1, -1, 0);
      threePointsCurve.position.set(0, -1, 0);

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

      const clock = new THREE.Clock();

      const camera = new THREE.PerspectiveCamera(
        110,
        width / height,
        0.01,
        100
      );
      camera.position.z = 2;
      this.camera = camera;

      const scene = new THREE.Scene();
      this.scene = scene;

      const pit = generatePit(
        this.pitWidth,
        this.pitHeight,
        this.pitDepth,
        this.gridColor
      );
      scene.add(pit);
      this.pit = pit;

      const light = new THREE.AmbientLight(this.lightColor); //  white light
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

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setAnimationLoop(animation);
      container.appendChild(renderer.domElement);
      this.renderer = renderer;

      this.updateRendererSize();
    },

    keyupHandler(event) {
      switch (event.code) {
        case "KeyW":
          console.log("Press W");
          this.zombie.position.setY(this.zombie.position.y + 1);
          break;
        case "KeyS":
          console.log("Press S");
          this.zombie.position.setY(this.zombie.position.y - 1);
          break;
        case "KeyA":
          console.log("Press A");
          this.zombie.position.setX(this.zombie.position.x - 1);
          break;
        case "KeyD":
          console.log("Press D");
          this.zombie.position.setX(this.zombie.position.x + 1);
          break;
        case "ArrowUp":
          this.zombie.position.setZ(this.zombie.position.z + 1);
          console.log("Press Up");
          break;
        case "ArrowDown":
          console.log("Press Down");
          this.zombie.position.setZ(this.zombie.position.z - 1);
          break;
        case "ArrowLeft":
          this.zombie.rotateX(Math.PI / 2);
          console.log("Press Left");
          break;
        case "ArrowRight":
          this.zombie.rotateZ(Math.PI / 2);
          console.log("Press Right");
          break;
        case "Space":
          console.log("Press Space");
          break;
        case "KeyP":
          console.log("Press P");
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

    window.addEventListener("resize", this.updateRendererSize());
    document.addEventListener("keyup", this.keyupHandler);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateRendererSize());
    document.removeEventListener("keyup", this.keyupHandler);
  },
};
