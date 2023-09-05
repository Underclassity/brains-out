import { Group } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";
import getGroupSize from "../get-group-size.js";

/**
 * Generate P25 form (block_images/p25.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP25Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P25 form");

  const pointGroup = new Group();

  pointGroup.name = "P25";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thirdMesh = generateMeshPoint(size, parts, isSimple);
  const fourthPoint = generateMeshPoint(size, parts, isSimple);
  const fifthPoint = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);
  childsGroup.add(fourthPoint);
  childsGroup.add(fifthPoint);

  pointGroup.add(childsGroup);

  // First level
  positionHelper(firstMesh, "x", -size / 2);
  positionHelper(firstMesh, "y", size);
  positionHelper(firstMesh, "z", -size / 2);

  positionHelper(secondMesh, "x", size / 2);
  positionHelper(secondMesh, "y", size);
  positionHelper(secondMesh, "z", -size / 2);

  positionHelper(thirdMesh, "x", size / 2);
  positionHelper(thirdMesh, "z", -size / 2);

  positionHelper(fourthPoint, "x", size / 2);
  positionHelper(fourthPoint, "y", -size);
  positionHelper(fourthPoint, "z", -size / 2);

  // Second level
  positionHelper(fifthPoint, "x", size / 2);
  positionHelper(fifthPoint, "z", size / 2);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateP25Form;
