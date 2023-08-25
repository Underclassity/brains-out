import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point";

/**
 * Generate three points form
 *
 * @return  {Object}  Group object
 */
export function generateThreePoints(size = 0.2) {
  const pointGroup = new Group();

  const firstMesh = generateMeshPoint();
  const secondMesh = generateMeshPoint();
  const thridMesh = generateMeshPoint();

  pointGroup.add(firstMesh);
  pointGroup.add(secondMesh);
  pointGroup.add(thridMesh);

  firstMesh.position.set(-size, 0, 0);
  secondMesh.position.set(0, 0, 0);
  thridMesh.position.set(size, 0, 0);

  return pointGroup;
}

export default generateThreePoints;
