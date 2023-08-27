import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";

/**
 * Generate one point form
 *
 * @return  {Object}  Group object
 */
export function generateOnePoint(size = 0.2) {
  console.log("Generate one point form");

  const pointGroup = new Group();

  pointGroup.userData.name = "1 point";

  const mesh = generateMeshPoint(size);

  pointGroup.add(mesh);

  return pointGroup;
}

export default generateOnePoint;
