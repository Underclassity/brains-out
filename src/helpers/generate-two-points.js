import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point";

/**
 * Generate two points form
 *
 * @return  {Object}  Group object
 */
export function generateTwoPoints(size = 0.2) {
  console.log("Generate two points form");

  const pointGroup = new Group();

  const firstMesh = generateMeshPoint();
  const secondMesh = generateMeshPoint();

  pointGroup.add(firstMesh);
  pointGroup.add(secondMesh);

  firstMesh.position.set(-size / 2, 0, 0);
  secondMesh.position.set(size / 2, 0, 0);

  return pointGroup;
}

export default generateTwoPoints;
