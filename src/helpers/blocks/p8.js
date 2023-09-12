import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateBodyMeshPoint from "../generate-body-mesh-point.js";
import generateHeadMeshPoint from "../generate-head-mesh-point.js";
import generateLegsMeshPoint from "../generate-legs-mesh-point.js";

/**
 * Generate P8 form (block_images/p8.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP8Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P8 form");

  const pointGroup = new Group();

  pointGroup.name = "P8";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateHeadMeshPoint(size, parts, isSimple);
  const secondMesh = generateBodyMeshPoint(size, parts, isSimple);
  const thirdMesh = generateBodyMeshPoint(size, parts, isSimple);
  const fourthPoint = generateLegsMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);
  childsGroup.add(fourthPoint);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size);
  positionHelper(firstMesh, "y", -size / 2);

  positionHelper(secondMesh, "y", -size / 2);

  positionHelper(thirdMesh, "x", size);
  positionHelper(thirdMesh, "y", size / 2);

  positionHelper(fourthPoint, "y", size / 2);

  pointGroup.userData.size = new Vector3(3, 2, 1);

  return pointGroup;
}

export default generateP8Form;
