// Form functions
import generateP0Form from "../../helpers/blocks/p0.js";
import generateP1Form from "../../helpers/blocks/p1.js";
import generateP2Form from "../../helpers/blocks/p2.js";
import generateP3Form from "../../helpers/blocks/p3.js";
import generateP4Form from "../../helpers/blocks/p4.js";
import generateP5Form from "../../helpers/blocks/p5.js";
import generateP6Form from "../../helpers/blocks/p6.js";
import generateP7Form from "../../helpers/blocks/p7.js";
import generateP8Form from "../../helpers/blocks/p8.js";
import generateP9Form from "../../helpers/blocks/p9.js";

import generateP10Form from "../../helpers/blocks/p10.js";
import generateP11Form from "../../helpers/blocks/p11.js";
import generateP12Form from "../../helpers/blocks/p12.js";
import generateP13Form from "../../helpers/blocks/p13.js";
import generateP14Form from "../../helpers/blocks/p14.js";
import generateP15Form from "../../helpers/blocks/p15.js";
import generateP16Form from "../../helpers/blocks/p16.js";
import generateP17Form from "../../helpers/blocks/p17.js";
import generateP18Form from "../../helpers/blocks/p18.js";
import generateP19Form from "../../helpers/blocks/p19.js";

import generateP20Form from "../../helpers/blocks/p20.js";
import generateP21Form from "../../helpers/blocks/p21.js";
import generateP22Form from "../../helpers/blocks/p22.js";
import generateP23Form from "../../helpers/blocks/p23.js";
import generateP24Form from "../../helpers/blocks/p24.js";
import generateP25Form from "../../helpers/blocks/p25.js";
import generateP26Form from "../../helpers/blocks/p26.js";
import generateP27Form from "../../helpers/blocks/p27.js";
import generateP28Form from "../../helpers/blocks/p28.js";
import generateP29Form from "../../helpers/blocks/p29.js";

import generateP30Form from "../../helpers/blocks/p30.js";
import generateP31Form from "../../helpers/blocks/p31.js";
import generateP32Form from "../../helpers/blocks/p32.js";
import generateP33Form from "../../helpers/blocks/p33.js";
import generateP34Form from "../../helpers/blocks/p34.js";
import generateP35Form from "../../helpers/blocks/p35.js";
import generateP36Form from "../../helpers/blocks/p36.js";
import generateP37Form from "../../helpers/blocks/p37.js";
import generateP38Form from "../../helpers/blocks/p38.js";
import generateP39Form from "../../helpers/blocks/p39.js";
import generateP40Form from "../../helpers/blocks/p40.js";

/**
 * Get random form helper
 *
 * @return  {Object}  Random form
 */
export function getRandomForm() {
  // log("Get random form call");

  let { size, isSimple, zombieParts, blocksType } = this;

  let formFunctions = [
    generateP0Form,
    generateP1Form,
    generateP2Form,
    generateP5Form,
    generateP6Form,
    generateP7Form,
    generateP8Form,
    generateP9Form,
  ];

  if (blocksType == "basic" || blocksType == "extended") {
    formFunctions.push(...[generateP32Form, generateP33Form, generateP34Form]);
  }

  if (blocksType == "extended") {
    formFunctions.push(
      ...[
        generateP3Form,
        generateP4Form,

        generateP10Form,
        generateP11Form,
        generateP12Form,
        generateP13Form,
        generateP14Form,
        generateP15Form,
        generateP16Form,
        generateP17Form,
        generateP18Form,
        generateP19Form,

        generateP20Form,
        generateP21Form,
        generateP22Form,
        generateP23Form,
        generateP24Form,
        generateP25Form,
        generateP26Form,
        generateP27Form,
        generateP28Form,
        generateP29Form,

        generateP30Form,
        generateP31Form,

        generateP35Form,
        generateP36Form,
        generateP37Form,
        generateP38Form,
        generateP39Form,
        generateP40Form,
      ]
    );
  }

  const isDevParts = Math.random() <= 0.01;
  const devId = Math.random() <= 0.5 ? "I" : "N";

  if (isDevParts) {
    formFunctions = [generateP2Form];

    zombieParts = zombieParts.filter(
      (item) => item.name[item.name.length - 1] == devId
    );
  } else {
    zombieParts = zombieParts.filter(
      (item) =>
        item.name[item.name.length - 1] != "I" &&
        item.name[item.name.length - 1] != "N"
    );
  }

  const formFunction =
    formFunctions[Math.floor(Math.random() * formFunctions.length)];

  // Create element
  const element = formFunction(size, zombieParts, isSimple);

  this.restrainElement(element);

  // log(
  //   `Created ${element.name}(${element.position.x.toFixed(
  //     1
  //   )}-${element.position.y.toFixed(1)}-${element.position.z.toFixed(1)})`
  // );

  if (isDevParts) {
    element.userData.devId = devId;
  }

  return element;
}

export default getRandomForm;
