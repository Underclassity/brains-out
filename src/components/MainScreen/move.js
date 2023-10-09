import log from "../../helpers/log.js";
import randomBetween from "../../helpers/random-between.js";

/**
 * Play random rotation sound helper
 *
 * @return  {Boolean}  Result
 */
export function playRandomRotateSound() {
  for (const id in this.rotateSounds) {
    if (this.rotateSounds[id].isPlaying) {
      this.rotateSounds[id].stop();
    }
  }

  const randomId = randomBetween(0, this.rotationSoundId.length - 1);

  if (this.rotateSounds[this.rotationSoundId[randomId]]) {
    this.rotateSounds[this.rotationSoundId[randomId]].play();
  }

  return true;
}

/**
 * Move current element to left point
 *
 * @return  {Object}  Current element
 */
export function moveLeft() {
  const { xy } = this.getCollisionPoints(this.current);

  if (xy?.length && xy.find((item) => item.dir == "left")) {
    return false;
  }

  this.translateHelper(this.current, "x", -1);
  this.restrainElement(this.current);

  this.playRandomRotateSound();

  return this.current;
}

/**
 * Move current element to right point
 *
 * @return  {Object}  Current element
 */
export function moveRight() {
  const { xy } = this.getCollisionPoints(this.current);

  if (xy?.length && xy.find((item) => item.dir == "right")) {
    return false;
  }

  this.translateHelper(this.current, "x", 1);
  this.restrainElement(this.current);

  this.playRandomRotateSound();

  return this.current;
}

/**
 * Move current element to up point
 *
 * @return  {Object}  Current element
 */
export function moveUp() {
  const { xy } = this.getCollisionPoints(this.current);

  if (xy?.length && xy.find((item) => item.dir == "top")) {
    return false;
  }

  this.translateHelper(this.current, "y", 1);
  this.restrainElement(this.current);

  this.playRandomRotateSound();

  return this.current;
}

/**
 * Move current element to down point
 *
 * @return  {Object}  Current element
 */
export function moveDown() {
  const { xy } = this.getCollisionPoints(this.current);

  if (xy?.length && xy.find((item) => item.dir == "bottom")) {
    return false;
  }

  this.translateHelper(this.current, "y", -1);
  this.restrainElement(this.current);

  this.playRandomRotateSound();

  return this.current;
}

/**
 * Rotate current element 90 degrees on X axis
 *
 * @return  {Object}  Current element
 */
export function rotateXPlus() {
  if (this.isRotateRestrain && this.rotateCount == this.maxRotate) {
    return false;
  }

  this.rotateCount += 1;

  const result = this.rotateHelper(this.current, "x", 90);
  this.restrainElement(this.current);

  if (result) {
    this.playRandomRotateSound();
  }

  return this.current;
}

/**
 * Rotate current element -90 degrees on X axis
 *
 * @return  {Object}  Current element
 */
export function rotateXMinus() {
  if (this.isRotateRestrain && this.rotateCount == this.maxRotate) {
    return false;
  }

  this.rotateCount += 1;

  const result = this.rotateHelper(this.current, "x", -90);
  this.restrainElement(this.current);

  if (result) {
    this.playRandomRotateSound();
  }

  return this.current;
}

/**
 * Rotate current element 90 degrees on Y axis
 *
 * @return  {Object}  Current element
 */
export function rotateYPlus() {
  if (this.isRotateRestrain && this.rotateCount == this.maxRotate) {
    return false;
  }

  this.rotateCount += 1;

  const result = this.rotateHelper(this.current, "y", 90);
  this.restrainElement(this.current);

  if (result) {
    this.playRandomRotateSound();
  }

  return this.current;
}

/**
 * Rotate current element -90 degrees on Y axis
 *
 * @return  {Object}  Current element
 */
export function rotateYMinus() {
  if (this.isRotateRestrain && this.rotateCount == this.maxRotate) {
    return false;
  }

  this.rotateCount += 1;

  const result = this.rotateHelper(this.current, "y", -90);
  this.restrainElement(this.current);

  if (result) {
    this.playRandomRotateSound();
  }

  return this.current;
}

/**
 * Rotate current element 90 degrees on Z axis
 *
 * @return  {Object}  Current element
 */
export function rotateZPlus() {
  if (this.isRotateRestrain && this.rotateCount == this.maxRotate) {
    return false;
  }

  this.rotateCount += 1;

  const result = this.rotateHelper(this.current, "z", 90);
  this.restrainElement(this.current);

  if (result) {
    this.playRandomRotateSound();
  }

  return this.current;
}

/**
 * Rotate current element -90 degrees on Z axis
 *
 * @return  {Object}  Current element
 */
export function rotateZMinus() {
  if (this.isRotateRestrain && this.rotateCount == this.maxRotate) {
    return false;
  }

  this.rotateCount += 1;

  const result = this.rotateHelper(this.current, "z", -90);
  this.restrainElement(this.current);

  if (result) {
    this.playRandomRotateSound();
  }

  return this.current;
}

export function randomRotate() {
  // log("Random rotate call");

  const rotateNumber = randomBetween(0, 5);

  switch (rotateNumber) {
    case 0:
      this.rotateXMinus();
      break;
    case 1:
      this.rotateXPlus();
      break;
    case 2:
      this.rotateYMinus();
      break;
    case 3:
      this.rotateYPlus();
      break;
    case 4:
      this.rotateZMinus();
      break;
    case 5:
      this.rotateZPlus();
      break;
  }

  return true;
}

export default moveRight;
