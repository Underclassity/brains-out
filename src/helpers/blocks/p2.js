import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateBodyMeshPoint from "../generate-body-mesh-point.js";
import generateHeadMeshPoint from "../generate-head-mesh-point.js";
import generateLegsMeshPoint from "../generate-legs-mesh-point.js";

/**
 * Generate P2 form (block_images/p2.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP2Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P2 form");

  const pointGroup = new Group();

  pointGroup.name = "P2";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateHeadMeshPoint(size, parts, isSimple);
  const secondMesh = generateBodyMeshPoint(size, parts, isSimple);
  const thirdMesh = generateLegsMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size);

  positionHelper(thirdMesh, "x", size);

  pointGroup.userData.size = new Vector3(3, 1, 1);

  return pointGroup;
}

export default generateP2Form;
