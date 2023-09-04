import { Group } from "three";

import { positionHelper } from "../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "./generate-mesh-point";
import getGroupSize from "./get-group-size.js";

/**
 * Generate five points line form (block_images/p4.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateFivePointsLine(
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
  const fifthMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);
  childsGroup.add(fourthMesh);
  childsGroup.add(fifthMesh);

  pointGroup.add(childsGroup);

  positionHelper(secondMesh, "x", -size * 2);
  positionHelper(thridMesh, "x", -size);
  positionHelper(fourthMesh, "x", size);
  positionHelper(fifthMesh, "x", size * 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateFivePointsLine;
