import { Group } from "three";

import { positionHelper } from "../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "./generate-mesh-point";
import getGroupSize from "./get-group-size.js";

/**
 * Generate three points form
 *
 * @param   {Number}  [size=0.2]   Size
 * @param   {Array}   [parts=[]]   Parts array
 *
 * @return  {Object}               Group object
 */
export function generateThreePoints(size = 0.2, parts = []) {
  // console.log("Generate three points form");

  const pointGroup = new Group();

  pointGroup.name = "3 points";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts);
  const secondMesh = generateMeshPoint(size, parts);
  const thridMesh = generateMeshPoint(size, parts);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size);

  positionHelper(thridMesh, "x", size);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateThreePoints;
