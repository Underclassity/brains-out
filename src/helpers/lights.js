import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * Load lights
 *
 * @return  {Object}  Promise object
 */
export function loadLights() {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();

    loader.load(
      "models/Lights1.gltf",
      (gltf) => {
        resolve(gltf);
      },
      // called while loading is progressing
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      // called when loading has errors
      (error) => {
        console.log("An error happened");
        resolve(false);
      }
    );
  });
}

export default loadLights;
