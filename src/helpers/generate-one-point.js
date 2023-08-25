import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";

/**
 * Generate one point form
 *
 * @return  {Object}  Group object
 */
export function generateOnePoint() {
  const pointGroup = new Group();

  const mesh = generateMeshPoint();

  pointGroup.add(mesh);

  return pointGroup;
}

export default generateOnePoint;
