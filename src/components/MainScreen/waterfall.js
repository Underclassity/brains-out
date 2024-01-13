// import generateSForm from "../../helpers/generate-s-form.js";
// import generateThreePoints from "../../helpers/generate-three-points.js";

import { Vector3 } from "three";

import getGroupSize from "../../helpers/get-group-size.js";
import getWorldPosisition from "../../helpers/get-world-position.js";
import log from "../../helpers/log.js";
// import roundValue from "../../helpers/round-value.js";

/**
 * Create new element helper
 *
 * @return  {Object}  Element object
 */
export function createElement() {
  if (this.isPetrifyDelay && this.petrifyDelayStatus) {
    return false;
  }

  if (this.isPetrify) {
    return false;
  }

  // Reset rotate count
  this.rotateCount = 0;

  log("Create element call");

  const element = this.next ? this.next.clone() : this.getRandomForm();

  this.removeObjWithChildren(this.next);

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

  // set start position on Z axis
  this.positionHelper(element, "z", 1);

  this.current = element;
  if (this.isRandomCorner) {
    this.moveToRandomCorner(this.current);
  }
  this.next = this.getRandomForm();
  this.next.position.set(0, 0, 1);
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

  if (this.current.userData.devId) {
    if (this.current.userData.devId == "I") {
      this.emitter.emit("addAchievement", "skater-boy");
    } else if (this.current.userData.devId == "N") {
      this.emitter.emit("addAchievement", "hoodie-boy");
    }
  }

  // Restrain after all changes
  this.restrainElement(element);

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

      // element.traverse((obj) => {
      //   if (!obj.isMesh) {
      //     return false;
      //   }

      //   if (Array.isArray(obj.material)) {
      //     const material = obj.material.find((item) =>
      //       item.name.includes("Emissive")
      //     );

      //     if (material) {
      //       console.log(material.emissiveIntensity);
      //     }
      //   }
      // });

      if (element.userData.drop && this.isFastDrop) {
        this.dropElement(element);
      } else {
        if (this.time - elTime > elSpeed * 2 && !this.isSmooth) {
          element.userData.time = this.time;
          return false;
        }

        const newZPosition =
          -(this.time - elTime) * elSpeed - elSize.z / 2 + this.size / 2 + 1;

        this.positionHelper(element, "z", newZPosition);
        this.restrainElement(element);
      }

      // Dont check on rotation
      if (this.isRotateAnimation && this.isRotating) {
        return false;
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

          const itemPosition = getWorldPosisition(pointElement, true);

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

          const itemPosition = getWorldPosisition(pointElement, true);

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

        if (minDiff >= 0 || isFreeze) {
          if (element.userData.position.z > 0) {
            return true;
          }

          // Translate back
          if (!isFreeze) {
            this.translateHelper(element, "z", -minDiff);
          }

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

    if (!this.current && this.isFirstTime && this.isControlsInfoShowed) {
      this.createElement();
    }
  });

  return true;
}

export default initWaterfall;
