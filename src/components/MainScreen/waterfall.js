import randomBetween from "../../helpers/random-between.js";

/**
 * Init waterfall mode
 *
 * @return  {Boolean}  Result
 */
export function initWaterfall() {
  console.log("Init waterfall");

  const { scene } = this;

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

      element.position.setZ(-(time - elTime) * this.speed - elSize.z / 2);

      // console.log(`${index}: ${element.position.z.toFixed(2)}`);

      if (element.position.z < -this.pitDepth + elSize.z / 2) {
        scene.remove(element);
        array[index] = undefined;
        return false;
      }

      // Try to random rotate every second
      if (!(Math.random() > 0.5 && Date.now() - rotateTime > 1000)) {
        element.userData.rotate = Date.now();
        return false;
      }

      // console.log("Rotate call");

      const axis = randomBetween(0, 2);

      this.rotateHelper(
        ["x", "y", "z"][axis],
        Math.random() > 0.5 ? 90 : -90,
        element
      );

      element.userData.rotate = Date.now();
    });

    elements = elements.filter((item) => item);

    const count = Math.round(time / 2);

    if (prevCount == count) {
      return false;
    }

    prevCount = count;

    const element = this.next ? this.next : this.getRandomForm();

    element.userData.time = time;

    // set start position on Z axis
    element.position.setZ(-element.userData.size.z / 2);

    elements.push(element);
    scene.add(element);

    this.current = element;
    this.next = this.getRandomForm();

    this.updatePreview();
  });

  return true;
}

export default initWaterfall;
