import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import log from "./log.js";

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
        log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      // called when loading has errors
      (error) => {
        log("An error happened");
        resolve(false);
      }
    );
  });
}

export default loadLights;
