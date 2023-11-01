import { TextureLoader } from "three";

import { log } from "./log.js";

// Init texture loader
const loader = new TextureLoader();

/**
 * Load texture helper
 *
 * @param   {String}    filename  Filename
 * @param   {String}    id        ID
 * @param   {Function}  cb        Load CB
 *
 * @return  {Object}              Result
 */
export function textureLoaderHelper(filename, id, cb) {
  if (!cb) {
    cb = log;
  }

  return new Promise((resolve) => {
    loader.load(
      `models/${filename}`,

      // onLoad callback
      (texture) => {
        log(`Loaded ${id} texture: `, texture);
        cb({
          name: id,
          loaded: 100,
          total: 100,
          percent: 1,
        });
        resolve(texture);
      },

      undefined,

      (error) => {
        log(error);
        resolve();
      }
    );
  });
}
