import { Group } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";
import getGroupSize from "../get-group-size.js";

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
  const thridMesh = generateMeshPoint(size, parts, isSimple);
  const fourthPoint = generateMeshPoint(size, parts, isSimple);
  const fifthMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thridMesh);
  childsGroup.add(fourthPoint);
  childsGroup.add(fifthMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size);
  positionHelper(firstMesh, "y", -size);

  positionHelper(secondMesh, "y", -size);

  positionHelper(thridMesh, "x", size);
  positionHelper(thridMesh, "y", -size);

  positionHelper(fifthMesh, "y", size);

  pointGroup.userData.size = getGroupSize(childsGroup);

  return pointGroup;
}

export default generateP11Form;
