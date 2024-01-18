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
 * Generate P5 form (block_images/p5.png)
 *
 * @param   {Number}    [size=0.2]         Size
 * @param   {Array}     [parts=[]]         Parts array
 * @param   {Boolean}   [isSimple=false]   Simple block render
 *
 * @return  {Object}                       Group object
 */
export function generateP5Form(size = 0.2, parts = [], isSimple = false) {
  // console.log("Generate P5 form");

  const pointGroup = new Group();

  pointGroup.name = "P5";

  const childsGroup = new Group();
  childsGroup.name = "childs";

  const type = randomBetween(0, 2);

  let firstMesh;
  let secondMesh;
  let thirdMesh;

  switch (type) {
    // Var A
    case 0:
      firstMesh = generateBrainsMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Brains1"
      );
      secondMesh = generateHeadMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Head2"
      );
      thirdMesh = generateBodyMeshPoint(size, parts, isSimple, false, [
        "Z_01_Body1",
        "Z_01_Body2",
      ]);
      break;
    // Var B
    case 1:
      firstMesh = generateHeadMeshPoint(size, parts, isSimple, false, [
        "Z_01_Head1",
        "Z_01_Head2",
        "H_01_Head1",
      ]);
      secondMesh = generateBodyMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Body2"
      );
      thirdMesh = generateGutsMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Guts1"
      );
      firstMesh.rotation.set(0, MathUtils.degToRad(-90), 0);
      secondMesh.rotation.set(0, MathUtils.degToRad(-90), 0);
      thirdMesh.rotation.set(0, MathUtils.degToRad(-90), 0);

      break;
    // Var C
    case 2:
      firstMesh = generateLegsMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Legs1"
      );
      secondMesh = generateBodyMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Body2"
      );
      thirdMesh = generateGutsMeshPoint(
        size,
        parts,
        isSimple,
        false,
        "Z_01_Guts1"
      );
      firstMesh.rotation.set(0, MathUtils.degToRad(90), 0);
      secondMesh.rotation.set(0, MathUtils.degToRad(90), 0);
      thirdMesh.rotation.set(0, MathUtils.degToRad(90), 0);

      break;
    // // Var D
    // case 3:
    //   firstMesh = generateHeadMeshPoint(size, parts, isSimple);
    //   secondMesh = generateBodyMeshPoint(
    //     size,
    //     parts,
    //     isSimple,
    //     false,
    //     "Z_01_Body3_1"
    //   );
    //   thirdMesh = generateBodyMeshPoint(
    //     size,
    //     parts,
    //     isSimple,
    //     false,
    //     "Z_01_Body3_2"
    //   );
    //   firstMesh.rotation.set(0, MathUtils.degToRad(-90), 0);
    //   secondMesh.rotation.set(0, MathUtils.degToRad(-90), 0);
    //   thirdMesh.rotation.set(0, MathUtils.degToRad(-90), 0);

    //   break;
    // // Var E
    // case 4:
    //   firstMesh = generateLegsMeshPoint(
    //     size,
    //     parts,
    //     isSimple,
    //     false,
    //     "Z_01_Legs1"
    //   );
    //   secondMesh = generateBodyMeshPoint(
    //     size,
    //     parts,
    //     isSimple,
    //     false,
    //     "Z_01_Body3_2"
    //   );
    //   thirdMesh = generateBodyMeshPoint(
    //     size,
    //     parts,
    //     isSimple,
    //     false,
    //     "Z_01_Body3_1"
    //   );
    //   firstMesh.rotation.set(0, MathUtils.degToRad(90), 0);
    //   secondMesh.rotation.set(
    //     MathUtils.degToRad(-180),
    //     MathUtils.degToRad(90),
    //     0
    //   );
    //   thirdMesh.rotation.set(
    //     MathUtils.degToRad(-180),
    //     MathUtils.degToRad(90),
    //     0
    //   );

    //   break;
    default:
      firstMesh = generateMeshPoint(size, parts, isSimple);
      secondMesh = generateMeshPoint(size, parts, isSimple);
      thirdMesh = generateMeshPoint(size, parts, isSimple);
      break;
  }

  childsGroup.add(firstMesh);
  childsGroup.add(secondMesh);
  childsGroup.add(thirdMesh);

  pointGroup.add(childsGroup);

  positionHelper(firstMesh, "x", -size / 2);
  positionHelper(firstMesh, "y", size / 2);

  positionHelper(secondMesh, "x", size / 2);
  positionHelper(secondMesh, "y", size / 2);

  positionHelper(thirdMesh, "x", size / 2);
  positionHelper(thirdMesh, "y", -size / 2);

  pointGroup.userData.size = new Vector3(2, 2, 1);

  return pointGroup;
}

export default generateP5Form;
