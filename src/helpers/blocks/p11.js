import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";

/**
 * Generate P11 form (block_images/p11.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP11Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P11 form");

  const pointGroup = new Group();

  pointGroup.name = "P11";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thirdMesh = generateMeshPoint(size, parts, isSimple);
  const fourthPoint = generateMeshPoint(size, parts, isSimple);
  const fifthMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);
  childsGroup.add(fourthPoint);
  childsGroup.add(fifthMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size);
  positionHelper(firstMesh, "y", -size);

  positionHelper(secondMesh, "y", -size);

  positionHelper(thirdMesh, "x", size);
  positionHelper(thirdMesh, "y", -size);

  positionHelper(fifthMesh, "y", size);

  pointGroup.userData.size = new Vector3(3, 3, 1);

  return pointGroup;
}

export default generateP11Form;
