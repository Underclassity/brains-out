import { Vector3, MathUtils } from "three";

import * as TWEEN from "@tweenjs/tween.js";

import getGroupSize from "../../helpers/get-group-size.js";
// import log from "../../helpers/log.js";

const xAxis = new Vector3(1, 0, 0).normalize();
const yAxis = new Vector3(0, 1, 0).normalize();
const zAxis = new Vector3(0, 0, 1).normalize();

/**
 * Rotate element helper
 *
 * @param   {Object}   element           Object3D
 * @param   {String}   [axisType="x"]    Axis type
 * @param   {Number}   [angle=90]        Angle in deg
 *
 * @return  {Object}                     Object3D
 */
export function rotateHelper(element, axisType = "x", angle = 90) {
  if (!element) {
    return false;
  }

  const angleValue = MathUtils.degToRad(angle);

  let axis = xAxis;

  switch (axisType) {
    case "x":
      axis = xAxis;
      break;
    case "y":
      axis = yAxis;
      break;
    case "z":
      axis = zAxis;
      break;

    default:
      axis = xAxis;
      break;
  }

  const childs = element.getObjectByName("childs");

  if (childs && !this.isRotateAnimation) {
    childs.rotateOnWorldAxis(axis, angleValue);

    // Update size after rotate
    element.userData.size = getGroupSize(element.getObjectByName("childs"));
  } else if (childs && this.isRotateAnimation) {
    let prev = 0;
    const animation = new TWEEN.Tween({
      value: 0,
    });
    animation.to({ value: angleValue }, 150);
    animation.onUpdate(({ value }) => {
      childs.rotateOnWorldAxis(axis, value - prev);

      prev = value;
    });
    animation.onComplete(() => {
      element.userData.size = getGroupSize(element.getObjectByName("childs"));
    });
    animation.start();
  }

  if (this?.restrainElement) {
    this.restrainElement(element);
  }

  return element;
}

/**
 * Set element position helper
 *
 * @param   {Object}   element           Object3D
 * @param   {String}   [axis="x"]        Axis type
 * @param   {Number}   [value=90]        Value
 *
 * @return  {Object}                     Object3D
 */
export function positionHelper(element, axis = "x", value) {
  if (!element) {
    return false;
  }

  // log("position", axis, value);

  switch (axis) {
    case "x":
      element.position.setX(value);
      break;
    case "y":
      element.position.setY(value);
      break;
    case "z":
      element.position.setZ(value);
      break;
  }

  return element;
}

/**
 * Translate element position helper
 *
 * @param   {Object}   element           Object3D
 * @param   {String}   [axis="x"]        Axis type
 * @param   {Number}   [value=90]        Value
 *
 * @return  {Object}                     Object3D
 */
export function translateHelper(element, axis = "x", value) {
  if (!element) {
    return false;
  }

  // log("translate", axis, value);

  switch (axis) {
    case "x":
      element.translateX(value);
      break;
    case "y":
      element.translateY(value);
      break;
    case "z":
      element.translateZ(value);
      break;
  }

  return element;
}

/**
 * Set layer point helper
 *
 * @param   {Number}   x           X layer position
 * @param   {Number}   y           Y layer position
 * @param   {Number}   z           Z layer position
 * @param   {Number}   [value=1]   Value
 *
 * @return  {Array}                Array with layers
 */
export function setLayerPoint(x, y, z, value = 1) {
  // log(`Set layer point ${x}-${y}-${z}`);

  // const allPointElements = this.layersElements
  //   .reduce((prev, curr) => {
  //     prev.push(...curr);
  //     return prev;
  //   }, [])
  //   .filter((item) => item)
  //   .map((item) => item.position)
  //   .map((item) => `${item.x}-${item.y}-${item.z}`);

  // if (allPointElements.length) {
  //   const inElements = allPointElements.includes(`${x}-${y}-${z}`);

  //   if (inElements) {
  //     debugger;
  //   }
  // }

  // Check for equal value
  if (this.layers[z][x][y] == value) {
    this.error = `Layer ${x}-${y}-${z} value equal ${value}!`;
    throw new Error(this.error);
  }

  this.layers[z][x][y] = value;

  // log(this.layers[z].map((xLayer) => xLayer.join("-")).join("\n"));

  // log(
  //   this.layers
  //     .map((layer) => {
  //       return layer.map((xLayer) => xLayer.join("-")).join("\n");
  //     })
  //     .join("\n" + new Array(pitWidth).join("-") + "\n")
  // );

  return this.layers;
}

export default rotateHelper;
