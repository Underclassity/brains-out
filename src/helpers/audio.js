import { AudioLoader } from "three";

import log from "./log.js";

/**
 * Load audio helper
 *
 * @param   {String}  filename  Filename
 *
 * @return  {Object}            Promise
 */
export function loadAudio(filename, cb) {
  return new Promise((resolve) => {
    const loader = new AudioLoader();

    loader.load(
      `sound/${filename}`,
      (audioBuffer) => {
        resolve(audioBuffer);
      },

      (xhr) => {
        log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        cb({
          name: filename,
          loaded: xhr.loaded,
          total: xhr.total,
          percent: xhr.loaded / xhr.total,
        });
      },

      (err) => {
        log("An error happened");
        resolve(false);
      }
    );
  });
}

export default loadAudio;
