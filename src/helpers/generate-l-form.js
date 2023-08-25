import { Group } from "three";

import generateMeshPoint from "./generate-mesh-point.js";

/**
 * Generate L form
 *
 * @return  {Object}  Group object
 */
export function generateLForm(size = 0.2) {
  const pointGroup = new Group();

  const firstMesh = generateMeshPoint();
  const secondMesh = generateMeshPoint();
  const thridMesh = generateMeshPoint();
  const fourthPoint = generateMeshPoint();

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
