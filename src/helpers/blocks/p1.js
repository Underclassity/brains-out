import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateMeshPoint from "../generate-mesh-point.js";

/**
 * Generate P1 form (block_images/p1.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP1Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P1 form");

  const pointGroup = new Group();

  pointGroup.name = "P1";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const firstMesh = generateMeshPoint(size, parts, isSimple);
  const secondMesh = generateMeshPoint(size, parts, isSimple);

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size / 2);

  positionHelper(secondMesh, "x", size / 2);

  pointGroup.userData.size = new Vector3(2, 1, 1);

  return pointGroup;
}

export default generateP1Form;
