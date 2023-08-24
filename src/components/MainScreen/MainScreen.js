import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export default {
  name: "MainScreen",

  data() {
    return {
      size: 0.2,
      speed: 1,

      pitWidth: 5,
      pitHeight: 5,
      pitDepth: 12,

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
    generateMeshPoint(line = true) {
      const { size } = this;

      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshNormalMaterial();

      const mesh = new THREE.Mesh(geometry, material);

      if (!line) {
        return mesh;
      }

      const group = new THREE.Group();

      const wireframe = new THREE.WireframeGeometry(mesh.geometry);
      const lineFrame = new THREE.LineSegments(wireframe);
      lineFrame.material.depthTest = false;
      lineFrame.material.opacity = 0.25;
      lineFrame.material.transparent = true;

      group.add(mesh);
      group.add(lineFrame);

      return group;
    },

    generateOnePoint() {
      const pointGroup = new THREE.Group();

      const mesh = this.generateMeshPoint();

      pointGroup.add(mesh);

      return pointGroup;
    },

    generateTwoPoints() {
      const { size } = this;

      const pointGroup = new THREE.Group();

      const firstMesh = this.generateMeshPoint();
      const secondMesh = this.generateMeshPoint();

      pointGroup.add(firstMesh);
      pointGroup.add(secondMesh);

      firstMesh.position.set(-size / 2, 0, 0);
      secondMesh.position.set(size / 2, 0, 0);

      return pointGroup;
    },

    generateThreePoints() {
      const { size } = this;

      const pointGroup = new THREE.Group();

      const firstMesh = this.generateMeshPoint();
      const secondMesh = this.generateMeshPoint();
      const thridMesh = this.generateMeshPoint();

      pointGroup.add(firstMesh);
      pointGroup.add(secondMesh);
      pointGroup.add(thridMesh);

      firstMesh.position.set(-size, 0, 0);
      secondMesh.position.set(0, 0, 0);
      thridMesh.position.set(size, 0, 0);

      return pointGroup;
    },

    generateThreePointsCurve() {
      const { size } = this;

      const pointGroup = new THREE.Group();

      const firstMesh = this.generateMeshPoint();
      const secondMesh = this.generateMeshPoint();
      const thridMesh = this.generateMeshPoint();

      pointGroup.add(firstMesh);
      pointGroup.add(secondMesh);
      pointGroup.add(thridMesh);

      firstMesh.position.set(-size, 0, 0);
      secondMesh.position.set(0, 0, 0);
      thridMesh.position.set(-size, size, 0);

      return pointGroup;
    },

    generateFourPoints() {
      const { size } = this;

      const pointGroup = new THREE.Group();

      const firstMesh = this.generateMeshPoint();
      const secondMesh = this.generateMeshPoint();
      const thridMesh = this.generateMeshPoint();
      const fourthPoint = this.generateMeshPoint();

      pointGroup.add(firstMesh);
      pointGroup.add(secondMesh);
      pointGroup.add(thridMesh);
      pointGroup.add(fourthPoint);

      firstMesh.position.set(-size / 2, -size / 2, 0);
      secondMesh.position.set(-size / 2, size / 2, 0);
      thridMesh.position.set(size / 2, -size / 2, 0);
      fourthPoint.position.set(size / 2, size / 2, 0);

      return pointGroup;
    },

    generateLForm() {
      const { size } = this;

      const pointGroup = new THREE.Group();

      const firstMesh = this.generateMeshPoint();
      const secondMesh = this.generateMeshPoint();
      const thridMesh = this.generateMeshPoint();
      const fourthPoint = this.generateMeshPoint();

      pointGroup.add(firstMesh);
      pointGroup.add(secondMesh);
      pointGroup.add(thridMesh);
      pointGroup.add(fourthPoint);

      firstMesh.position.set(-size, 0, 0);
      secondMesh.position.set(0, 0, 0);
      thridMesh.position.set(size, 0, 0);
      fourthPoint.position.set(-size, -size, 0);

      return pointGroup;
    },

    generateTForm() {
      const { size } = this;

      const pointGroup = new THREE.Group();

      const firstMesh = this.generateMeshPoint();
      const secondMesh = this.generateMeshPoint();
      const thridMesh = this.generateMeshPoint();
      const fourthPoint = this.generateMeshPoint();

      pointGroup.add(firstMesh);
      pointGroup.add(secondMesh);
      pointGroup.add(thridMesh);
      pointGroup.add(fourthPoint);

      firstMesh.position.set(-size, 0, 0);
      secondMesh.position.set(0, 0, 0);
      thridMesh.position.set(size, 0, 0);
      fourthPoint.position.set(0, size, 0);

      return pointGroup;
    },

    generateSForm() {
      const { size } = this;

      const pointGroup = new THREE.Group();

      const firstMesh = this.generateMeshPoint();
      const secondMesh = this.generateMeshPoint();
      const thridMesh = this.generateMeshPoint();
      const fourthPoint = this.generateMeshPoint();

      pointGroup.add(firstMesh);
      pointGroup.add(secondMesh);
      pointGroup.add(thridMesh);
      pointGroup.add(fourthPoint);

      firstMesh.position.set(-size, 0, 0);
      secondMesh.position.set(0, 0, 0);
      thridMesh.position.set(size, size, 0);
      fourthPoint.position.set(0, size, 0);

      return pointGroup;
    },

    updateRendererSize() {
      console.log("Resize call");

      const { container } = this.$refs;

      const containerRect = container.getBoundingClientRect();

      this.renderer.setSize(containerRect.width, containerRect.height);
    },

    ToQuads(g) {
      const p = g.parameters;
      const segmentsX =
        (g.type == "TorusBufferGeometry"
          ? p.tubularSegments
          : p.radialSegments) ||
        p.widthSegments ||
        p.thetaSegments ||
        p.points.length - 1 ||
        1;
      const segmentsY =
        (g.type == "TorusBufferGeometry"
          ? p.radialSegments
          : p.tubularSegments) ||
        p.heightSegments ||
        p.phiSegments ||
        p.segments ||
        1;
      const indices = [];
      for (let i = 0; i < segmentsY + 1; i++) {
        let index11 = 0;
        let index12 = 0;
        for (let j = 0; j < segmentsX; j++) {
          index11 = (segmentsX + 1) * i + j;
          index12 = index11 + 1;
          const index21 = index11;
          const index22 = index11 + (segmentsX + 1);
          indices.push(index11, index12);
          if (index22 < (segmentsX + 1) * (segmentsY + 1) - 1) {
            indices.push(index21, index22);
          }
        }
        if (index12 + segmentsX + 1 <= (segmentsX + 1) * (segmentsY + 1) - 1) {
          indices.push(index12, index12 + segmentsX + 1);
        }
      }
      g.setIndex(indices);
    },

    generateGrid(width = 10, height = 10, color = 0x808080) {
      const group = new THREE.Group();

      const gXY = new THREE.PlaneGeometry(width, height, width, height);
      this.ToQuads(gXY);
      const mXY = new THREE.LineBasicMaterial({ color });

      const grXY = new THREE.LineSegments(gXY, mXY);

      group.add(grXY);

      return grXY;
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
      camera.position.z = 1.5;
      this.camera = camera;

      const scene = new THREE.Scene();
      this.scene = scene;

      const bottomPlane = this.generateGrid(
        this.pitWidth,
        this.pitHeight,
        0x808080
      );
      bottomPlane.position.z = -this.pitDepth;

      const downPlane = this.generateGrid(
        this.pitWidth,
        this.pitDepth,
        0x808080
      );
      downPlane.rotateX(Math.PI / 2);
      downPlane.position.z = -this.pitDepth / 2;
      downPlane.position.y = -this.pitHeight / 2;

      const upPlane = this.generateGrid(this.pitWidth, this.pitDepth, 0x808080);
      upPlane.rotateX(Math.PI / 2);
      upPlane.position.z = -this.pitDepth / 2;
      upPlane.position.y = this.pitHeight / 2;

      const leftPlane = this.generateGrid(
        this.pitHeight,
        this.pitDepth,
        0x808080
      );
      leftPlane.rotateY(Math.PI / 2);
      leftPlane.rotateZ(Math.PI / 2);
      leftPlane.position.z = -this.pitDepth / 2;
      leftPlane.position.x = -this.pitWidth / 2;

      const rightPlane = this.generateGrid(
        this.pitHeight,
        this.pitDepth,
        0x808080
      );
      rightPlane.rotateY(Math.PI / 2);
      rightPlane.rotateZ(Math.PI / 2);
      rightPlane.position.z = -this.pitDepth / 2;
      rightPlane.position.x = this.pitWidth / 2;

      scene.add(bottomPlane);
      scene.add(downPlane);
      scene.add(upPlane);
      scene.add(leftPlane);
      scene.add(rightPlane);

      const onePoint = this.generateOnePoint();
      const twoPoints = this.generateTwoPoints();
      const threePoints = this.generateThreePoints();
      const fourPoints = this.generateFourPoints();
      const lForm = this.generateLForm();
      const tForm = this.generateTForm();
      const sForm = this.generateSForm();
      const threePointsCurve = this.generateThreePointsCurve();

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
          console.log("Press Left");
          break;
        case "ArrowRight":
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
