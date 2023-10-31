import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

import log from "./log.js";

const castShadow = true;
const receiveShadow = true;

/**
 * Load fbx helper
 *
 * @param   {String}    filename        Filename
 * @param   {String}    id              File ID
 * @param   {Function}  cb              Progress callback function
 * @param   {Number}    [scale=0.01]    Scale value
 *
 * @return  {Object}                    Load Promise
 */
function loadHelper(filename, id, cb, scale = 0.01) {
  log(`Load ${id} model`);

  return new Promise((resolve) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      `models/${filename}`,
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });
        object.scale.set(scale, scale, scale);

        log(
          `Loaded ${id} parts: `,
          object.children.map((item) => item.name)
        );

        resolve(object);
      },
      (xhr) => {
        log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        cb({
          name: id,
          loaded: xhr.loaded,
          total: xhr.total,
          percent: xhr.loaded / xhr.total,
        });
      },
      (error) => {
        log(error);
        resolve();
      }
    );
  });
}

/**
 * Load zombie parts
 *
 * @return  {Object}  Promise
 */
export async function loadZombie(cb) {
  return loadHelper("S_ZombiesV1.0.fbx", "zombie", cb);
}

/**
 * Load test cube
 *
 * @return  {Object}  Promise
 */
export async function loadTestCube(cb) {
  return loadHelper("TestMaterialCube.fbx", "cube", cb);
}

/**
 * Load pit parts helper
 *
 * @param   {Function}  cb  Load callback
 *
 * @return  {Object}        Promise
 */
export async function loadPitParts(cb) {
  return loadHelper("GroundGrass.fbx", "pit", cb, 1);
}

/**
 * Load pit parts helper
 *
 * @param   {Function}  cb  Load callback
 *
 * @return  {Object}        Promise
 */
export async function loadHalloweenParts(cb) {
  return loadHelper("HalloweenModels_01.fbx", "halloween", cb, 1);
}

/**
 * Load dev parts helper
 *
 * @param   {Function}  cb  Load callback
 *
 * @return  {Object}        Promise
 */
export async function loadDevParts(cb) {
  return loadHelper("DEV_ZombiesV1.0.fbx", "dev", cb, 1);
}

/**
 * Load all parts helper
 *
 * @param   {Function}  cb  Load callback
 *
 * @return  {Object}        Promise
 */
export async function loadParts(cb) {
  return loadHelper("BrainsOutModels_01.fbx", "parts", cb, 1);
}

export default loadZombie;
