import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { BufferGeometryLoader } from "three/src/loaders/BufferGeometryLoader.js";

import log from "./log.js";

const castShadow = true;
const receiveShadow = true;

/**
 * Load zombie parts
 *
 * @return  {Object}  Promise
 */
export async function loadZombie() {
  log("Load Zombie model");

  return new Promise((resolve) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      "models/S_Zombie_1-2-3-4.fbx",
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
            //   log(texture);
            //   // render(); // only if there is no render loop
            // });
            // log(child.geometry.attributes.uv);

            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });
        object.scale.set(0.01, 0.01, 0.01);

        log("Loaded zombie", object);

        resolve(object);
      },
      (xhr) => {
        log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        log(error);
        resolve();
      }
    );
  });
}

/**
 * Load test cube
 *
 * @return  {Object}  Promise
 */
export async function loadTestCube() {
  log("Load test cube model");

  return new Promise((resolve) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      "models/TestMaterialCube.fbx",
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
            //   log(texture);
            //   // render(); // only if there is no render loop
            // });
            // log(child.geometry.attributes.uv);

            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });
        object.scale.set(0.01, 0.01, 0.01);

        log("Loaded test cube", object);

        resolve(object);
      },
      (xhr) => {
        log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        log(error);
        resolve();
      }
    );
  });
}

export async function loadPitParts() {
  log("Load pit parts model");

  return new Promise((resolve) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      "models/GroundGrass.fbx",
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
            //   log(texture);
            //   // render(); // only if there is no render loop
            // });
            // log(child.geometry.attributes.uv);

            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;

            child.scale.set(1, 1, 1);
          }
        });
        object.scale.set(1, 1, 1);

        log("Loaded pit parts", object);

        resolve(object);
      },
      (xhr) => {
        log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        log(error);
        resolve();
      }
    );
  });
}

export function loadSuzanne() {
  log("Load pit parts model");

  return new Promise((resolve) => {
    const bufferGeometryLoader = new BufferGeometryLoader();
    bufferGeometryLoader.load(
      "models/suzanne_buffergeometry.json",
      (geometry) => {
        geometry.name = "suzanne";
        resolve(geometry);
      },
      (xhr) => {
        log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        log(error);
        resolve();
      }
    );
  });
}

export default loadZombie;
