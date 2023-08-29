import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";
import getGroupSize from "./get-group-size.js";

/**
 * Generate three points curve
 *
 * @param   {Number}  [size=0.2]   Size
 * @param   {Array}   [parts=[]]   Parts array
 *
 * @return  {Object}               Group object
 */
export function generateThreePointsCurve(size = 0.2, parts = []) {
  console.log("Generate three points curve form");

  const pointGroup = new Group();

  pointGroup.name = "3 points curve";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts);
  const secondMesh = generateMeshPoint(size, parts);
  const thridMesh = generateMeshPoint(size, parts);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);

  pointGroup.add(childsGroup);

  firstMesh.position.set(-size / 2, -size / 2, 0);
  secondMesh.position.set(size / 2, -size / 2, 0);
  thridMesh.position.set(-size / 2, size / 2, 0);

  pointGroup.userData.size = getGroupSize(pointGroup);

  return pointGroup;
}

export default generateThreePointsCurve;
