import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";

/**
 * Generate P39 form (block_images/p39.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP39Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P39 form");

  const pointGroup = new Group();

  pointGroup.name = "P39";

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
  positionHelper(firstMesh, "x", -size);
  positionHelper(firstMesh, "y", size / 2);
  positionHelper(firstMesh, "z", -size / 2);

  positionHelper(secondMesh, "y", size / 2);
  positionHelper(secondMesh, "z", -size / 2);

  positionHelper(thirdMesh, "y", -size / 2);
  positionHelper(thirdMesh, "z", -size / 2);

  // Second level
  positionHelper(fourthPoint, "y", size / 2);
  positionHelper(fourthPoint, "z", size / 2);

  positionHelper(fifthPoint, "x", size);
  positionHelper(fifthPoint, "y", size / 2);
  positionHelper(fifthPoint, "z", size / 2);

  pointGroup.userData.size = new Vector3(3, 2, 2);

  return pointGroup;
}

export default generateP39Form;
