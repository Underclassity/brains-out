// import generateSForm from "../../helpers/generate-s-form.js";
// import generateThreePoints from "../../helpers/generate-three-points.js";

/**
 * Create new element helper
 *
 * @return  {Object}  Element object
 */
export function createElement() {
  console.log("Create element call");

  const element = this.next ? this.next.clone() : this.getRandomForm();

  this.scene.remove(this.next);

  element.position.set(0, 0, 0);
  element.rotation.set(0, 0, 0);
  element.scale.set(1, 1, 1);

  element.userData.time = this.time;
  element.userData.static = false;

  // set start position on Z axis
  this.positionHelper(element, "z", -element.userData.size.z / 2);

  this.current = element;
  this.next = this.getRandomForm(this.size, this.zombieParts);
  this.next.position.set(0, 0, 0);
  this.next.scale.set(0.2, 0.2, 0.2);

  this.scene.add(element);
  this.scene.add(this.next);
  this.elements.push(element);

  this.updatePreview();

  return element;
}

/**
 * Init waterfall mode
 *
 * @return  {Boolean}  Result
 */
export function initWaterfall() {
  console.log("Init waterfall");

  let prevCount = undefined;

  this.loopCb.push(() => {
    if (this.isPause) {
      this.elements.forEach((element) => {
        if (!element.userData.timeDiff) {
          element.userData.timeDiff = this.time - element.userData.time;
        }

        element.userData.time = this.time - element.userData.timeDiff;
      });

      prevCount = Math.round(this.time / 2);

      return false;
    }

    this.elements.forEach((element, index, array) => {
      if (!element) {
        return false;
      }

      element.userData.timeDiff = undefined;

      const elTime = element.userData.time;
      const elSize = element.userData.size;
      const elSpeed = element.userData.drop ? this.maxSpeed : this.speed;

      if (element.userData.drop) {
        this.dropElement(element);
      } else {
        const newZPosition = -(this.time - elTime) * elSpeed - elSize.z / 2;

        this.positionHelper(element, "z", newZPosition);
        this.restrainElement(element);
      }

      // console.log(`${index}: ${element.position.z.toFixed(2)}`);

      const isFreeze = this.collisionElement(element);

      if (!isFreeze) {
        return false;
      }

      element.userData.static = true;
      array[index] = undefined;
      this.petrify(element);

      this.createElement();

      return true;
    });

    this.elements = this.elements
      .filter((item) => item)
      .filter((item) => !item.userData.static);

    const count = Math.round(this.time / 2);

    if (prevCount == count) {
      return false;
    }

    prevCount = count;

    if (!this.current) {
      this.createElement();
    }
  });

  return true;
}

export default initWaterfall;
