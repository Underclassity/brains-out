import { Group } from "three";

import { positionHelper } from "../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "./generate-mesh-point";
import getGroupSize from "./get-group-size.js";

/**
 * Generate four points line form (block_images/p3.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateFourPointsLine(
  size = 0.2,
  parts = [],
  isSimple = false
) {
  // console.log("Generate three points form");

  const pointGroup = new Group();

  pointGroup.name = "4 points line";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thridMesh = generateMeshPoint(size, parts, isSimple);
  const fourthMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);
  childsGroup.add(fourthMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", (-size / 2) * 3);
  positionHelper(secondMesh, "x", -size / 2);
  positionHelper(thridMesh, "x", size / 2);
  positionHelper(fourthMesh, "x", (size / 2) * 3);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateFourPointsLine;
