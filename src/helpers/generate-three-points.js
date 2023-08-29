import { Group } from "three";

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
  console.log("Generate three points form");

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

  firstMesh.position.set(-size, 0, 0);
  secondMesh.position.set(0, 0, 0);
  thridMesh.position.set(size, 0, 0);

  pointGroup.userData.size = getGroupSize(pointGroup);

  return pointGroup;
}

export default generateThreePoints;
