import { Group } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";
import getGroupSize from "../get-group-size.js";

/**
 * Generate P33 form (block_images/p33.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP33Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P33 form");

  const pointGroup = new Group();

  pointGroup.name = "P33";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thirdMesh = generateMeshPoint(size, parts, isSimple);
  const fourthPoint = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);
  childsGroup.add(fourthPoint);

  pointGroup.add(childsGroup);

  // First level
  positionHelper(firstMesh, "x", -size / 2);
  positionHelper(firstMesh, "y", size / 2);
  positionHelper(firstMesh, "z", -size / 2);

  positionHelper(secondMesh, "x", size / 2);
  positionHelper(secondMesh, "y", size / 2);
  positionHelper(secondMesh, "z", -size / 2);

  positionHelper(thirdMesh, "x", size / 2);
  positionHelper(thirdMesh, "y", -size / 2);
  positionHelper(thirdMesh, "z", -size / 2);

  // Second level
  positionHelper(fourthPoint, "x", -size / 2);
  positionHelper(fourthPoint, "y", size / 2);
  positionHelper(fourthPoint, "z", size / 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateP33Form;
