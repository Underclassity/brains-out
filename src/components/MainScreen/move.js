/**
 * Move current element to left point
 *
 * @return  {Object}  Current element
 */
export function moveLeft() {
  this.translateHelper(this.current, "x", -1);
  this.restrainElement(this.current);

  return this.current;
}

/**
 * Move current element to right point
 *
 * @return  {Object}  Current element
 */
export function moveRight() {
  this.translateHelper(this.current, "x", 1);
  this.restrainElement(this.current);

  return this.current;
}

/**
 * Move current element to up point
 *
 * @return  {Object}  Current element
 */
export function moveUp() {
  this.translateHelper(this.current, "y", 1);
  this.restrainElement(this.current);

  return this.current;
}

/**
 * Move current element to down point
 *
 * @return  {Object}  Current element
 */
export function moveDown() {
  this.translateHelper(this.current, "y", -1);
  this.restrainElement(this.current);

  return this.current;
}

/**
 * Rotate current element 90 degrees on X axis
 *
 * @return  {Object}  Current element
 */
export function rotateXPlus() {
  this.rotateHelper(this.current, "x", 90);
  return this.current;
}

/**
 * Rotate current element -90 degrees on X axis
 *
 * @return  {Object}  Current element
 */
export function rotateXMinus() {
  this.rotateHelper(this.current, "x", -90);
  return this.current;
}

/**
 * Rotate current element 90 degrees on Y axis
 *
 * @return  {Object}  Current element
 */
export function rotateYPlus() {
  this.rotateHelper(this.current, "y", 90);
  return this.current;
}

/**
 * Rotate current element -90 degrees on Y axis
 *
 * @return  {Object}  Current element
 */
export function rotateYMinus() {
  this.rotateHelper(this.current, "y", -90);
  return this.current;
}

/**
 * Rotate current element 90 degrees on Z axis
 *
 * @return  {Object}  Current element
 */
export function rotateZPlus() {
  this.rotateHelper(this.current, "z", 90);
  return this.current;
}

/**
 * Rotate current element -90 degrees on Z axis
 *
 * @return  {Object}  Current element
 */
export function rotateZMinus() {
  this.rotateHelper(this.current, "z", -90);
  return this.current;
}

export default moveRight;
