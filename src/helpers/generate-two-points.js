import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point";
import getGroupSize from "./get-group-size.js";

/**
 * Generate two points form
 *
 * @param   {Number}  [size=0.2]   Size
 * @param   {Array}   [parts=[]]   Parts array
 *
 * @return  {Object}               Group object
 */
export function generateTwoPoints(size = 0.2, parts = []) {
  console.log("Generate two points form");

  const pointGroup = new Group();

  pointGroup.name = "2 points";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts);
  const secondMesh = generateMeshPoint(size, parts);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);

  pointGroup.add(childsGroup);

  firstMesh.position.set(-size / 2, 0, 0);
  secondMesh.position.set(size / 2, 0, 0);

  pointGroup.userData.size = getGroupSize(pointGroup);

  return pointGroup;
}

export default generateTwoPoints;
