import { Group } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";
import getGroupSize from "../get-group-size.js";

/**
 * Generate P38 form (block_images/p38.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP38Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P38 form");

  const pointGroup = new Group();

  pointGroup.name = "P38";

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
  positionHelper(firstMesh, "y", size / 2);
  positionHelper(firstMesh, "z", -size / 2);

  positionHelper(secondMesh, "x", size);
  positionHelper(secondMesh, "y", size / 2);
  positionHelper(secondMesh, "z", -size / 2);

  positionHelper(thridMesh, "y", -size / 2);
  positionHelper(thridMesh, "z", -size / 2);

  // Second level
  positionHelper(fourthPoint, "y", size / 2);
  positionHelper(fourthPoint, "z", size / 2);

  positionHelper(fifthPoint, "x", -size);
  positionHelper(fifthPoint, "y", size / 2);
  positionHelper(fifthPoint, "z", size / 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateP38Form;
