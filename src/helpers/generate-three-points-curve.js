import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";
import getGroupSize from "./get-group-size.js";

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

  firstMesh.position.set(-size / 2, -size / 2, 0);
  secondMesh.position.set(size / 2, -size / 2, 0);
  thridMesh.position.set(-size / 2, size / 2, 0);

  pointGroup.userData.size = getGroupSize(pointGroup);

  return pointGroup;
}

export default generateThreePointsCurve;
