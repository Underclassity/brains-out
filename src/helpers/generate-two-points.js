import { Group } from "three";

import { positionHelper } from "../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "./generate-mesh-point";
import getGroupSize from "./get-group-size.js";

/**
 * Generate two points form
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateTwoPoints(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate two points form");

  const pointGroup = new Group();

  pointGroup.name = "2 points";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size / 2);

  positionHelper(secondMesh, "x", size / 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateTwoPoints;
