import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";
import getGroupSize from "./get-group-size.js";

/**
 * Generate one point
 *
 * @param   {Number}  [size=0.2]   Size
 * @param   {Array}   [parts=[]]   Parts array
 *
 * @return  {Object}               Group object
 */
export function generateOnePoint(size = 0.2, parts = []) {
  console.log("Generate one point form");

  const pointGroup = new Group();

  pointGroup.name = "1 point";

  const mesh = generateMeshPoint(size, parts);

  const childsGroup = new Group();
  childsGroup.name = "childs";

  childsGroup.add(mesh);
  pointGroup.add(childsGroup);

  pointGroup.userData.size = getGroupSize(pointGroup);

  return pointGroup;
}

export default generateOnePoint;
