import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";

/**
 * Generate three points form
 *
 * @return  {Object}  Group object
 */
export function generateThreePointsCurve(size = 0.2) {
  console.log("Generate three points curve form");

  const pointGroup = new Group();

  pointGroup.userData.name = "3 points curve";

  const firstMesh = generateMeshPoint(size);
  const secondMesh = generateMeshPoint(size);
  const thridMesh = generateMeshPoint(size);

  pointGroup.add(firstMesh);
  pointGroup.add(secondMesh);
  pointGroup.add(thridMesh);

  firstMesh.position.set(-size, 0, 0);
  secondMesh.position.set(0, 0, 0);
  thridMesh.position.set(-size, size, 0);

  return pointGroup;
}

export default generateThreePointsCurve;
