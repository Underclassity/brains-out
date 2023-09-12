import { Group, Vector3 } from "three";

import { positionHelper } from "../../components/MainScreen/transform-helpers.js";
import generateBodyMeshPoint from "../generate-body-mesh-point.js";
import generateBrainsMeshPoint from "../generate-brains-mesh-point.js";
import generateGutsMeshPoint from "../generate-guts-mesh-point.js";
import generateHeadMeshPoint from "../generate-head-mesh-point.js";
import generateLegsMeshPoint from "../generate-legs-mesh-point.js";
import generateMeshPoint from "../generate-mesh-point.js";
import randomBetween from "../random-between.js";

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

  const type = randomBetween(0, 5);

  let firstMesh;
  let secondMesh;

  switch (type) {
    // Var A
    case 0:
      firstMesh = generateHeadMeshPoint(size, parts, isSimple);
      secondMesh = generateBodyMeshPoint(size, parts, isSimple);
      break;
    // Var B
    case 1:
      firstMesh = generateBodyMeshPoint(size, parts, isSimple);
      secondMesh = generateLegsMeshPoint(size, parts, isSimple);
      break;
    // Var C
    case 2:
      firstMesh = generateBrainsMeshPoint(size, parts, isSimple);
      secondMesh = generateHeadMeshPoint(size, parts, isSimple);
      break;
    // Var D
    case 3:
      firstMesh = generateGutsMeshPoint(size, parts, isSimple);
      secondMesh = generateBodyMeshPoint(size, parts, isSimple);
      break;
    // Var E
    case 4:
      firstMesh = generateBodyMeshPoint(size, parts, isSimple);
      secondMesh = generateBodyMeshPoint(size, parts, isSimple);
      break;
    // Var Gnome
    case 5:
      firstMesh = generateHeadMeshPoint(size, parts, isSimple);
      secondMesh = generateLegsMeshPoint(size, parts, isSimple);
      break;
    default:
      firstMesh = generateMeshPoint(size, parts, isSimple);
      secondMesh = generateMeshPoint(size, parts, isSimple);
      break;
  }

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size / 2);

  positionHelper(secondMesh, "x", size / 2);

  pointGroup.userData.size = new Vector3(2, 1, 1);

  return pointGroup;
}

export default generateP1Form;
