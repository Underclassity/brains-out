import * as THREE from "three";

export default {
  name: "MainScreen",

  data() {
    return {
      size: 0.2,

      camera: undefined,
      scene: undefined,
      renderer: undefined,
    };
  },

  methods: {
    generateMeshPoint() {
      const { size } = this;

      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshNormalMaterial();

      const mesh = new THREE.Mesh(geometry, material);

      return mesh;
    },

    generateOnePoint() {
      const pointGroup = new THREE.Group();
      pointGroup.add(this.generateMeshPoint());

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

    init() {
      const { container } = this.$refs;

      const width = 800;
      const height = 600;

      const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
      camera.position.z = 3;
      this.camera = camera;

      const scene = new THREE.Scene();
      this.scene = scene;

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

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setAnimationLoop(animation);
      container.appendChild(renderer.domElement);
      this.renderer = renderer;

      this.updateRendererSize();

      // animation

      function animation(time) {
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
          group.rotation.x = time / 2000;
          group.rotation.y = time / 1000;
          group.rotation.z = time / 3000;
        });

        renderer.render(scene, camera);
      }
    },
  },

  mounted() {
    this.init();

    window.addEventListener("resize", this.updateRendererSize());
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateRendererSize());
  },
};
