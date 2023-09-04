import { Group } from "three";

import { positionHelper } from "../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "./generate-mesh-point.js";
import getGroupSize from "./get-group-size.js";

/**
 * Generate four points form (block_images/p6.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateFourPoints(size = 0.2, parts = [], isSimple = false) {
  // console.log(`Generate four points form: size ${size}`);

  const pointGroup = new Group();

  pointGroup.name = "4 points";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thridMesh = generateMeshPoint(size, parts, isSimple);
  const fourthPoint = generateMeshPoint(size, parts, isSimple);

  const childsGroup = new Group();
  childsGroup.name = "childs";

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);
  childsGroup.add(fourthPoint);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size / 2);
  positionHelper(firstMesh, "y", -size / 2);

  positionHelper(secondMesh, "x", -size / 2);
  positionHelper(secondMesh, "y", size / 2);

  positionHelper(thridMesh, "x", size / 2);
  positionHelper(thridMesh, "y", -size / 2);

  positionHelper(fourthPoint, "x", size / 2);
  positionHelper(fourthPoint, "y", size / 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateFourPoints;
