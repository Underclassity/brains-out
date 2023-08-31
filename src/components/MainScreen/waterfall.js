import randomBetween from "../../helpers/random-between.js";

/**
 * Init waterfall mode
 *
 * @return  {Boolean}  Result
 */
export function initWaterfall() {
  console.log("Init waterfall");

  const { scene, pitDepth } = this;

  let prevCount = undefined;

  let elements = [];

  this.loopCb.push((delta, timeDelta, second) => {
    const time = this.isSmooth ? timeDelta : second;

    if (this.isPause) {
      elements.forEach((element) => {
        if (!element.userData.timeDiff) {
          element.userData.timeDiff = time - element.userData.time;
        }

        element.userData.time = time - element.userData.timeDiff;
      });

      prevCount = Math.round(time / 2);

      return false;
    }

    elements.forEach((element, index, array) => {
      if (!element) {
        return false;
      }

      element.userData.timeDiff = undefined;

      const elTime = element.userData.time;
      const rotateTime = element.userData.rotate || 0;
      const elSize = element.userData.size;

      const newZPosition = -(time - elTime) * this.speed - elSize.z / 2;

      this.positionHelper(element, "z", newZPosition);

      this.restrainElement(element);

      // console.log(`${index}: ${element.position.z.toFixed(2)}`);

      const isFreeze = this.collisionElement(element);

      if (element.position.z < -pitDepth + elSize.z / 2 || isFreeze) {
        // scene.remove(element);
        element.userData.static = true;
        array[index] = undefined;
        this.petrify(element);
        return false;
      }

      // // Try to random rotate every second
      // if (!(Math.random() > 0.5 && Date.now() - rotateTime > 1000)) {
      //   element.userData.rotate = Date.now();
      //   return false;
      // }

      // // console.log("Rotate call");

      // const axis = randomBetween(0, 2);

      // this.rotateHelper(
      //   ["x", "y", "z"][axis],
      //   Math.random() > 0.5 ? 90 : -90,
      //   element
      // );

      // element.userData.rotate = Date.now();
    });

    elements = elements
      .filter((item) => item)
      .filter((item) => !item.userData.static);

    const count = Math.round(time / 2);

    if (prevCount == count) {
      return false;
    }

    prevCount = count;

    const element = this.next ? this.next.clone() : this.getRandomForm();

    element.userData.time = time;
    element.userData.static = false;

    // set start position on Z axis
    this.positionHelper(element, "z", -element.userData.size.z / 2);

    this.current = element;
    this.next = this.getRandomForm();

    scene.add(element);
    elements.push(element);

    this.updatePreview();
  });

  return true;
}

export default initWaterfall;
