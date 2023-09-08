import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";

/**
 * Generate P4 form (block_images/p4.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP4Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P4 form");

  const pointGroup = new Group();

  pointGroup.name = "P4";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thirdMesh = generateMeshPoint(size, parts, isSimple);
  const fourthMesh = generateMeshPoint(size, parts, isSimple);
  const fifthMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);
  childsGroup.add(fourthMesh);
  childsGroup.add(fifthMesh);

  pointGroup.add(childsGroup);

  positionHelper(secondMesh, "x", -size * 2);
  positionHelper(thirdMesh, "x", -size);
  positionHelper(fourthMesh, "x", size);
  positionHelper(fifthMesh, "x", size * 2);

  pointGroup.userData.size = new Vector3(5, 1, 1);

  return pointGroup;
}

export default generateP4Form;
