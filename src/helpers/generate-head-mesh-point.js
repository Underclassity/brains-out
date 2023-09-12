import generateMeshPoint from "./generate-mesh-point.js";
import randomBetween from "./random-between.js";

/**
 * Generate random head mesh point
 *
 * @param   {Number}   [size=0.2]         Point size
 * @param   {Array}    [parts=[]]         Parts array
 * @param   {Boolean}  [isSimple=false]   Render simple block flag
 * @param   {Boolean}  [line=false]       Render lines flag
 *
 * @return  {Object}                      Group objects
 */
export function generateHeadMeshPoint(
  size = 0.2,
  parts = [],
  isSimple = false,
  line = false
) {
  const headParts = parts.filter((item) => item.name.includes("Head"));

  const headPart = headParts[randomBetween(0, headParts.length - 1)];

  return generateMeshPoint(size, [headPart], isSimple, line);
}

export default generateHeadMeshPoint;
