import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";

/**
 * Generate L form
 *
 * @return  {Object}  Group object
 */
export function generateLForm(size = 0.2) {
  console.log("Generate L form");

  const pointGroup = new Group();

  const firstMesh = generateMeshPoint(size);
  const secondMesh = generateMeshPoint(size);
  const thridMesh = generateMeshPoint(size);
  const fourthPoint = generateMeshPoint(size);

  pointGroup.add(firstMesh);
  pointGroup.add(secondMesh);
  pointGroup.add(thridMesh);
  pointGroup.add(fourthPoint);

  firstMesh.position.set(-size, 0, 0);
  secondMesh.position.set(0, 0, 0);
  thridMesh.position.set(size, 0, 0);
  fourthPoint.position.set(-size, -size, 0);

  return pointGroup;
}

export default generateLForm;
