import { Vector3, MathUtils } from "three";

import getGroupSize from "../../helpers/get-group-size.js";
import log from "../../helpers/log.js";

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

  if (childs) {
    childs.rotateOnWorldAxis(axis, angleValue);

    // Update size after rotate
    element.userData.size = getGroupSize(element.getObjectByName("childs"));
  }

  if (this && this.restrainElement) {
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

export function setLayerPoint(x, y, z) {
  log(`Set layer point ${x}-${y}-${z}`);

  this.layers[z][x][y] = 1;

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
