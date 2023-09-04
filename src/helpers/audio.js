import { AudioLoader } from "three";

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
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },

      (err) => {
        console.log("An error happened");
        resolve(false);
      }
    );
  });
}

export default loadAudio;
