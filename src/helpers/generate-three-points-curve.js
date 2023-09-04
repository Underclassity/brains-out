import { Group } from "three";

import { positionHelper } from "../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "./generate-mesh-point.js";
import getGroupSize from "./get-group-size.js";

/**
 * Generate three points curve (block_images/p5.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateThreePointsCurve(
  size = 0.2,
  parts = [],
  isSimple = false
) {
  // console.log("Generate three points curve form");

  const pointGroup = new Group();

  pointGroup.name = "3 points curve";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thridMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size / 2);
  positionHelper(firstMesh, "y", -size / 2);

  positionHelper(secondMesh, "x", size / 2);
  positionHelper(secondMesh, "y", -size / 2);

  positionHelper(thridMesh, "x", -size / 2);
  positionHelper(thridMesh, "y", size / 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateThreePointsCurve;
