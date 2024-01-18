import { Group, Vector3, MathUtils } from "three";

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

  const type = randomBetween(0, 4);

  let firstMesh;
  let secondMesh;

  switch (type) {
    // Var A
    case 0:
      firstMesh = generateHeadMeshPoint(size, parts, isSimple, false, [
        "Z_01_Head1",
        "Z_01_Head2",
        "H_01_Head1",
      ]);
      secondMesh = generateBodyMeshPoint(size, parts, isSimple, false, [
        "Z_01_Body1",
        "Z_01_Body2",
      ]);
      break;
    // Var B
    case 1:
      firstMesh = generateBodyMeshPoint(size, parts, isSimple, false, [
        "Z_01_Body1",
        "Z_01_Body2",
      ]);
      secondMesh = generateLegsMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Legs1"
      );
      break;
    // Var C
    case 2:
      firstMesh = generateHeadMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Head2"
      );
      secondMesh = generateBrainsMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Brains1"
      );
      firstMesh.rotation.set(
        0,
        MathUtils.degToRad(-90),
        MathUtils.degToRad(90)
      );
      break;
    // Var D
    case 3:
      firstMesh = generateGutsMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Guts1"
      );
      secondMesh = generateBodyMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Body2"
      );
      firstMesh.rotation.set(MathUtils.degToRad(-180), 0, 0);
      secondMesh.rotation.set(MathUtils.degToRad(-180), 0, 0);
      break;
    // // Var E
    // case 4:
    //   firstMesh = generateBodyMeshPoint(
    //     size,
    //     parts,
    //     isSimple,
    //     false,
    //     "Z_01_Body3_1"
    //   );
    //   secondMesh = generateBodyMeshPoint(
    //     size,
    //     parts,
    //     isSimple,
    //     false,
    //     "Z_01_Body3_2"
    //   );
    //   firstMesh.rotation.set(0, MathUtils.degToRad(180), 0);
    //   break;
    // Var Gnome
    case 4:
      firstMesh = generateHeadMeshPoint(size, parts, isSimple, false, [
        "Z_01_Head1",
        "Z_01_Head2",
        "H_01_Head1",
      ]);
      secondMesh = generateLegsMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Legs1"
      );
      break;
    default:
      firstMesh = generateMeshPoint(size, parts, isSimple);
      secondMesh = generateMeshPoint(size, parts, isSimple);
      break;
  }

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "y", size / 2);

  positionHelper(secondMesh, "y", -size / 2);

  pointGroup.userData.size = new Vector3(1, 2, 1);

  return pointGroup;
}

export default generateP1Form;
