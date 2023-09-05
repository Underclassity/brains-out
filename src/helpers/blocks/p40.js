import { Group } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";
import getGroupSize from "../get-group-size.js";

/**
 * Generate P40 form (block_images/p40.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP40Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P40 form");

  const pointGroup = new Group();

  pointGroup.name = "P40";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thridMesh = generateMeshPoint(size, parts, isSimple);
  const fourthPoint = generateMeshPoint(size, parts, isSimple);
  const fifthPoint = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);
  childsGroup.add(fourthPoint);
  childsGroup.add(fifthPoint);

  pointGroup.add(childsGroup);

  // First level
  positionHelper(firstMesh, "x", -size / 2);
  positionHelper(firstMesh, "y", size / 2);
  positionHelper(firstMesh, "z", -size / 2);

  positionHelper(secondMesh, "x", size / 2);
  positionHelper(secondMesh, "y", size / 2);
  positionHelper(secondMesh, "z", -size / 2);

  positionHelper(thridMesh, "x", -size / 2);
  positionHelper(thridMesh, "y", -size / 2);
  positionHelper(thridMesh, "z", -size / 2);

  // Second level
  positionHelper(fourthPoint, "x", -size / 2);
  positionHelper(fourthPoint, "y", -size / 2);
  positionHelper(fourthPoint, "z", size / 2);

  positionHelper(fifthPoint, "x", size / 2);
  positionHelper(fifthPoint, "y", -size / 2);
  positionHelper(fifthPoint, "z", size / 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateP40Form;
