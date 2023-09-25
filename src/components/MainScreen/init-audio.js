import { Audio, AudioListener } from "three";

import loadAudio from "../../helpers/audio.js";

/**
 * Init all sound
 *
 * @return  {Boolean}  Result
 */
export async function initAudio() {
  const { scene, camera, bgSound } = this;

  if (!scene || !camera) {
    return false;
  }

  // // Update sound
  // if (bgSound) {
  //   const audioBuffer = await loadAudio(bgSoundId, this.progressCb);

  //   bgSound.stop();
  //   bgSound.setBuffer(audioBuffer);
  //   bgSound.play();

  //   return true;
  // }

  await Promise.all([
    this.initBgSound(),
    this.initBgMenuSound(),
    this.initDropSound(),
    this.initEndSound(),
    this.initClearSound(),
    this.initRotateSounds(),
  ]);

  return bgSound;
}

/**
 * Init main bg sound
 *
 * @return  {Boolean}  Result
 */
export async function initBgSound() {
  const { scene, bgSoundId, camera, volume } = this;

  // instantiate a listener
  const audioListener = new AudioListener();

  // add the listener to the camera
  camera.add(audioListener);

  // instantiate audio object
  const soundInstance = new Audio(audioListener);

  // add the audio object to the scene
  scene.add(soundInstance);

  const audioBuffer = await loadAudio(bgSoundId, this.progressCb);

  soundInstance.setBuffer(audioBuffer);

  soundInstance.setLoop(true);
  soundInstance.setVolume(volume);

  this.bgSound = soundInstance;

  let counter = 0;
  while (
    Math.round(this.bgSound.getVolume() * 100) / 100 != volume &&
    counter <= 100
  ) {
    this.bgSound.setVolume(volume);
    counter++;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/**
 * Init menu bg sound
 *
 * @return  {Boolean}  Result
 */
export async function initBgMenuSound() {
  const { scene, bgMenuSoundId, camera, volume } = this;

  // instantiate a listener
  const audioListener = new AudioListener();

  // add the listener to the camera
  camera.add(audioListener);

  // instantiate audio object
  const soundInstance = new Audio(audioListener);

  // add the audio object to the scene
  scene.add(soundInstance);

  const audioBuffer = await loadAudio(bgMenuSoundId, this.progressCb);

  soundInstance.setBuffer(audioBuffer);

  soundInstance.setLoop(true);
  soundInstance.setVolume(volume);

  // soundInstance.play();

  this.bgMenuSound = soundInstance;

  let counter = 0;
  while (
    Math.round(this.bgMenuSound.getVolume() * 100) / 100 != volume &&
    counter <= 100
  ) {
    this.bgMenuSound.setVolume(volume);
    counter++;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/**
 * Init drop sound
 *
 * @return  {Boolean}  Result
 */
export async function initDropSound() {
  const { scene, camera, fallSoundId, fxVolume } = this;

  for (const id of fallSoundId) {
    const audioListener = new AudioListener();
    camera.add(audioListener);

    const soundInstance = new Audio(audioListener);
    scene.add(soundInstance);

    const audioBuffer = await loadAudio(id, this.progressCb);

    soundInstance.setBuffer(audioBuffer);
    soundInstance.setVolume(fxVolume);

    this.dropSounds[id] = soundInstance;
  }

  return true;
}

/**
 * Init end game sound
 *
 * @return  {Boolean}  Result
 */
export async function initEndSound() {
  const { scene, camera, endGameSoundId, fxVolume } = this;

  const audioListener = new AudioListener();
  camera.add(audioListener);

  const soundInstance = new Audio(audioListener);
  scene.add(soundInstance);

  const audioBuffer = await loadAudio(endGameSoundId, this.progressCb);

  soundInstance.setBuffer(audioBuffer);
  soundInstance.setVolume(fxVolume);

  this.endSound = soundInstance;

  return soundInstance;
}

/**
 * Init clear level sound
 *
 * @return  {Boolean}  Result
 */
export async function initClearSound() {
  const { scene, camera, levelSoundId, fxVolume } = this;

  const audioListener = new AudioListener();
  camera.add(audioListener);

  const soundInstance = new Audio(audioListener);
  scene.add(soundInstance);

  const audioBuffer = await loadAudio(levelSoundId, this.progressCb);

  soundInstance.setBuffer(audioBuffer);
  soundInstance.setVolume(fxVolume);

  this.clearSound = soundInstance;

  return soundInstance;
}

/**
 * Init rotate forms sound
 *
 * @return  {Boolean}  Result
 */
export async function initRotateSounds() {
  const { rotationSoundId, scene, fxVolume, camera } = this;

  for (const id of rotationSoundId) {
    if (this.rotateSounds[id]) {
      continue;
    }

    const audioListener = new AudioListener();
    camera.add(audioListener);

    const soundInstance = new Audio(audioListener);
    scene.add(soundInstance);

    const audioBuffer = await loadAudio(id, this.progressCb);

    soundInstance.setBuffer(audioBuffer);
    soundInstance.setVolume(fxVolume * 0.5);

    this.rotateSounds[id] = soundInstance;
  }

  return true;
}

export default initAudio;
