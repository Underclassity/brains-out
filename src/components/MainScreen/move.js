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

export default moveRight;
