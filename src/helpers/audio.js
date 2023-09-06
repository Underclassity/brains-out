import { AudioLoader } from "three";

import log from "./log.js";

/**
 * Load audio helper
 *
 * @param   {String}  filename  Filename
 *
 * @return  {Object}            Promise
 */
export function loadAudio(filename) {
  return new Promise((resolve) => {
    const loader = new AudioLoader();

    loader.load(
      `sound/${filename}`,
      (audioBuffer) => {
        resolve(audioBuffer);
      },

      (xhr) => {
        log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },

      (err) => {
        log("An error happened");
        resolve(false);
      }
    );
  });
}

export default loadAudio;
