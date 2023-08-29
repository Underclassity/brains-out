import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";
import getGroupSize from "./get-group-size.js";

/**
 * Generate S form
 *
 * @param   {Number}  [size=0.2]   Size
 * @param   {Array}   [parts=[]]   Parts array
 *
 * @return  {Object}               Group object
 */
export function generateSForm(size = 0.2, parts = []) {
  console.log("Generate S form");

  const pointGroup = new Group();

  pointGroup.name = "S form";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts);
  const secondMesh = generateMeshPoint(size, parts);
  const thridMesh = generateMeshPoint(size, parts);
  const fourthPoint = generateMeshPoint(size, parts);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);
  childsGroup.add(fourthPoint);

  pointGroup.add(childsGroup);

  firstMesh.position.set(-size, -size / 2, 0);
  secondMesh.position.set(0, -size / 2, 0);
  thridMesh.position.set(size, size / 2, 0);
  fourthPoint.position.set(0, size / 2, 0);

  pointGroup.userData.size = getGroupSize(pointGroup);

  return pointGroup;
}

export default generateSForm;
