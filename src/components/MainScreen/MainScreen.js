import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

import generateFourPoints from "../../helpers/generate-four-points.js";
import generateLForm from "../../helpers/generate-l-form.js";
import generateOnePoint from "../../helpers/generate-one-point.js";
import generatePit from "../../helpers/generate-pit.js";
import generateSForm from "../../helpers/generate-s-form.js";
import generateTForm from "../../helpers/generate-t-form.js";
import generateThreePoints from "../../helpers/generate-three-points.js";
import generateThreePointsCurve from "../../helpers/generate-three-points-curve.js";
import generateTwoPoints from "../../helpers/generate-two-points.js";

export default {
  name: "MainScreen",

  data() {
    return {
      size: 0.2,
      speed: 1,

      pitWidth: 5,
      pitHeight: 5,
      pitDepth: 12,

      gridColor: 0x808080,

      isPause: false,

      camera: undefined,
      scene: undefined,
      renderer: undefined,
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

      this.renderer.setSize(containerRect.width, containerRect.height);
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

      const onePoint = generateOnePoint();
      const twoPoints = generateTwoPoints();
      const threePoints = generateThreePoints();
      const fourPoints = generateFourPoints();
      const lForm = generateLForm();
      const tForm = generateTForm();
      const sForm = generateSForm();
      const threePointsCurve = generateThreePointsCurve();

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

      const light = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(light);

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

        [
          onePoint,
          twoPoints,
          threePoints,
          fourPoints,
          lForm,
          tForm,
          sForm,
          threePointsCurve,
        ].forEach((group) => {
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

      const fbxLoader = new FBXLoader();
      fbxLoader.load(
        "/models/S_Zombie_01.fbx",
        (object) => {
          // object.traverse(function (child) {
          //     if ((child as THREE.Mesh).isMesh) {
          //         // (child as THREE.Mesh).material = material
          //         if ((child as THREE.Mesh).material) {
          //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
          //         }
          //     }
          // })
          // object.scale.set(.01, .01, .01)

          object.traverse(function (child) {
            if (child.isMesh) {
              // const loader = new THREE.TextureLoader();

              // loader.load("/models/T_ColorAtlas16x16.png", (texture) => {
              //   child.material.map = texture;
              //   child.material.needsupdate = true;
              //   console.log(texture);
              //   // render(); // only if there is no render loop
              // });
              // console.log(child.geometry.attributes.uv);

              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          object.scale.set(0.01, 0.01, 0.01);

          object.userData.name = "Zombie";

          object.position.setZ(-5);
          object.position.setY(-1);

          scene.add(object);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.log(error);
        }
      );
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
