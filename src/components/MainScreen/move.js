/**
 * Move current element to left point
 *
 * @return  {Object}  Current element
 */
export function moveLeft() {
  this.scene.remove(this.current);
  this.current.translateX(-1);
  this.scene.add(this.current);
  this.restrainElement(this.current);

  return this.current;
}

/**
 * Move current element to right point
 *
 * @return  {Object}  Current element
 */
export function moveRight() {
  this.scene.remove(this.current);
  this.current.translateX(1);
  this.scene.add(this.current);
  this.restrainElement(this.current);

  return this.current;
}

/**
 * Move current element to up point
 *
 * @return  {Object}  Current element
 */
export function moveUp() {
  this.scene.remove(this.current);
  this.current.translateY(1);
  this.scene.add(this.current);
  this.restrainElement(this.current);

  return this.current;
}

/**
 * Move current element to down point
 *
 * @return  {Object}  Current element
 */
export function moveDown() {
  this.scene.remove(this.current);
  this.current.translateY(-1);
  this.scene.add(this.current);
  this.restrainElement(this.current);

  return this.current;
}

export default moveRight;
