import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";

/**
 * Generate P3 form (block_images/p3.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP3Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P3 form");

  const pointGroup = new Group();

  pointGroup.name = "P3";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);
  const thirdMesh = generateMeshPoint(size, parts, isSimple);
  const fourthMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);
  childsGroup.add(fourthMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", (-size / 2) * 3);
  positionHelper(secondMesh, "x", -size / 2);
  positionHelper(thirdMesh, "x", size / 2);
  positionHelper(fourthMesh, "x", (size / 2) * 3);

  pointGroup.userData.size = new Vector3(4, 1, 1);

  return pointGroup;
}

export default generateP3Form;
