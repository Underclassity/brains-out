// import generateSForm from "../../helpers/generate-s-form.js";
// import generateThreePoints from "../../helpers/generate-three-points.js";

import { MeshBasicMaterial, Vector3 } from "three";

import getGroupSize from "../../helpers/get-group-size.js";
import getRandom from "../../helpers/random.js";
import log from "../../helpers/log.js";
// import roundValue from "../../helpers/round-value.js";

/**
 * Create new element helper
 *
 * @return  {Object}  Element object
 */
export function createElement() {
  if (this.isPetrify) {
    return false;
  }

  // Reset rotate count
  this.rotateCount = 0;

  log("Create element call");

  const element = this.next ? this.next.clone() : this.getRandomForm();

  this.scene.remove(this.next);

  element.position.set(0, 0, 0);
  element.rotation.set(0, 0, 0);
  element.scale.set(1, 1, 1);

  if (this.next != undefined) {
    element.userData.size = element.userData?.size
      ? new Vector3(
          element.userData.size.x * 2,
          element.userData.size.y * 2,
          element.userData.size.z * 2
        )
      : getGroupSize(element);
  }

  element.userData.time = this.time;
  element.userData.static = false;

  if (this.isRandomColor) {
    let color = getRandom(this.colorPalette, 1)[0];

    while (color == this.prevColor) {
      color = getRandom(this.colorPalette, 1)[0];
    }

    // Save prev color
    this.prevColor = color;

    element.traverse((obj) => {
      if (!obj.isMesh) {
        return;
      }

      obj.material = new MeshBasicMaterial({ color });
    });
  }

  // set start position on Z axis
  this.positionHelper(element, "z", -element.userData.size.z / 2);

  this.current = element;
  this.moveToRandomCorner(this.current);
  this.next = this.getRandomForm(this.size, this.zombieParts);
  this.next.position.set(0, 0, 0);
  this.next.scale.set(0.5, 0.5, 0.5);
  this.next.userData.size = this.next.userData?.size
    ? new Vector3(
        this.next.userData.size.x / 2,
        this.next.userData.size.y / 2,
        this.next.userData.size.z / 2
      )
    : getGroupSize(this.next);

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
  log("Init waterfall");

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

      if (element.userData.drop && this.isFastDrop) {
        this.dropElement(element);
      } else {
        const newZPosition = -(this.time - elTime) * elSpeed - elSize.z / 2;

        this.positionHelper(element, "z", newZPosition);
        this.restrainElement(element);
      }

      const isFreeze = this.collisionElement(element);
      const { z, cover } = this.getCollisionPoints(element);

      if (cover?.length) {
        for (const { item, point } of cover) {
          if (item.z == 0 && point.z) {
            this.endGameCall(this.current);
            return false;
          }

          const pointElement = element.getObjectByProperty("uuid", point.uuid);

          const itemPosition = new Vector3();
          pointElement.getWorldPosition(itemPosition);

          const layerPosition = this.zCPoints[item.z];

          const diff = layerPosition - itemPosition.z;

          // Translate back
          this.translateHelper(element, "z", -diff);

          element.userData.static = true;
          array[index] = undefined;
          this.petrify(element);

          this.createElement();

          return true;
        }
      }

      if (z?.length) {
        let minDiff = undefined;

        for (const { item, point } of z) {
          const pointElement = element.getObjectByProperty("uuid", point.uuid);

          const itemPosition = new Vector3();
          pointElement.getWorldPosition(itemPosition);

          const layerPosition = this.zCPoints[item.z];

          const diff = layerPosition - itemPosition.z;

          if (item.z - point.z == 1) {
            minDiff = 0;
          }

          if (minDiff == 0) {
            continue;
          }

          if (minDiff == undefined) {
            minDiff = diff;
          } else if (diff > minDiff) {
            minDiff = diff;
          }
        }

        if (minDiff >= 0) {
          // Translate back
          this.translateHelper(element, "z", -minDiff);

          element.userData.static = true;
          array[index] = undefined;
          this.petrify(element);

          this.createElement();

          return true;
        }
      } else if (isFreeze) {
        element.userData.static = true;
        array[index] = undefined;
        this.petrify(element);

        this.createElement();
      }

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
