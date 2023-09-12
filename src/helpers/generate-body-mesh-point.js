import generateMeshPoint from "./generate-mesh-point.js";
import randomBetween from "./random-between.js";

/**
 * Generate random body mesh point
 *
 * @param   {Number}   [size=0.2]         Point size
 * @param   {Array}    [parts=[]]         Parts array
 * @param   {Boolean}  [isSimple=false]   Render simple block flag
 * @param   {Boolean}  [line=false]       Render lines flag
 *
 * @return  {Object}                      Group objects
 */
export function generateBodyMeshPoint(
  size = 0.2,
  parts = [],
  isSimple = false,
  line = false
) {
  const bodyParts = parts.filter((item) => item.name.includes("Body"));

  const bodyPart = bodyParts[randomBetween(0, bodyParts.length - 1)];

  return generateMeshPoint(size, [bodyPart], isSimple, line);
}

export default generateBodyMeshPoint;
