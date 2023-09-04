import { Group } from "three";

import { positionHelper } from "../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "./generate-mesh-point.js";
import getGroupSize from "./get-group-size.js";

/**
 * Generate S form (block_images/p8.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateSForm(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate S form");

  const pointGroup = new Group();

  pointGroup.name = "S form";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thridMesh = generateMeshPoint(size, parts, isSimple);
  const fourthPoint = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);
  childsGroup.add(fourthPoint);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size);
  positionHelper(firstMesh, "y", -size / 2);

  positionHelper(secondMesh, "y", -size / 2);

  positionHelper(thridMesh, "x", size);
  positionHelper(thridMesh, "y", size / 2);

  positionHelper(fourthPoint, "y", size / 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateSForm;
