import generateMeshPoint from "./generate-mesh-point.js";
import randomBetween from "./random-between.js";

/**
 * Generate random legs mesh point
 *
 * @param   {Number}   [size=0.2]         Point size
 * @param   {Array}    [parts=[]]         Parts array
 * @param   {Boolean}  [isSimple=false]   Render simple block flag
 * @param   {Boolean}  [line=false]       Render lines flag
 *
 * @return  {Object}                      Group objects
 */
export function generateLegsMeshPoint(
  size = 0.2,
  parts = [],
  isSimple = false,
  line = false
) {
  const legsParts = parts.filter((item) => item.name.includes("Legs"));

  const legPart = legsParts[randomBetween(0, legsParts.length - 1)];

  return generateMeshPoint(size, [legPart], isSimple, line);
}

export default generateLegsMeshPoint;
