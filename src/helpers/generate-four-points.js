import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";

/**
 * Generate four points form
 *
 * @return  {Object}  Group object
 */
export function generateFourPoints(size = 0.2) {
  console.log("Generate four points form");

  const pointGroup = new Group();

  const firstMesh = generateMeshPoint(size);
  const secondMesh = generateMeshPoint(size);
  const thridMesh = generateMeshPoint(size);
  const fourthPoint = generateMeshPoint(size);

  pointGroup.add(firstMesh);
  pointGroup.add(secondMesh);
  pointGroup.add(thridMesh);
  pointGroup.add(fourthPoint);

  firstMesh.position.set(-size / 2, -size / 2, 0);
  secondMesh.position.set(-size / 2, size / 2, 0);
  thridMesh.position.set(size / 2, -size / 2, 0);
  fourthPoint.position.set(size / 2, size / 2, 0);

  return pointGroup;
}

export default generateFourPoints;
