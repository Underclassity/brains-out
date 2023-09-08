import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";

/**
 * Generate P16 form (block_images/p16.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP16Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P16 form");

  const pointGroup = new Group();

  pointGroup.name = "P16";

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

  positionHelper(firstMesh, "x", -size / 2);
  positionHelper(firstMesh, "y", (size / 2) * 3);

  positionHelper(secondMesh, "x", -size / 2);
  positionHelper(secondMesh, "y", size / 2);

  positionHelper(thirdMesh, "x", -size / 2);
  positionHelper(thirdMesh, "y", -size / 2);

  positionHelper(fourthPoint, "x", -size / 2);
  positionHelper(fourthPoint, "y", (-size / 2) * 3);

  positionHelper(fifthPoint, "x", size / 2);
  positionHelper(fifthPoint, "y", -size / 2);

  pointGroup.userData.size = new Vector3(2, 4, 1);

  return pointGroup;
}

export default generateP16Form;
