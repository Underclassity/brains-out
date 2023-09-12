import generateMeshPoint from "./generate-mesh-point.js";
import randomBetween from "./random-between.js";

/**
 * Generate random brains mesh point
 *
 * @param   {Number}   [size=0.2]         Point size
 * @param   {Array}    [parts=[]]         Parts array
 * @param   {Boolean}  [isSimple=false]   Render simple block flag
 * @param   {Boolean}  [line=false]       Render lines flag
 *
 * @return  {Object}                      Group objects
 */
export function generateBrainsMeshPoint(
  size = 0.2,
  parts = [],
  isSimple = false,
  line = false
) {
  const brainsParts = parts.filter((item) => item.name.includes("Brains"));

  const brainsPart = brainsParts[randomBetween(0, brainsParts.length - 1)];

  return generateMeshPoint(size, [brainsPart], isSimple, line);
}

export default generateBrainsMeshPoint;
