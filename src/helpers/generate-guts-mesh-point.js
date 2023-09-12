import generateMeshPoint from "./generate-mesh-point.js";
import randomBetween from "./random-between.js";

/**
 * Generate random guts mesh point
 *
 * @param   {Number}   [size=0.2]         Point size
 * @param   {Array}    [parts=[]]         Parts array
 * @param   {Boolean}  [isSimple=false]   Render simple block flag
 * @param   {Boolean}  [line=false]       Render lines flag
 *
 * @return  {Object}                      Group objects
 */
export function generateGutsMeshPoint(
  size = 0.2,
  parts = [],
  isSimple = false,
  line = false
) {
  const gutsParts = parts.filter((item) => item.name.includes("Guts"));

  const gutsPart = gutsParts[randomBetween(0, gutsParts.length - 1)];

  return generateMeshPoint(size, [gutsPart], isSimple, line);
}

export default generateGutsMeshPoint;
