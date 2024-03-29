import generateMeshPoint from "./generate-mesh-point.js";
import randomBetween from "./random-between.js";

/**
 * Generate random guts mesh point
 *
 * @param   {Number}   [size=0.2]         Point size
 * @param   {Array}    [parts=[]]         Parts array
 * @param   {Boolean}  [isSimple=false]   Render simple block flag
 * @param   {Boolean}  [line=false]       Render lines flag
 * @param   {String}   [name=false]       Part name
 *
 * @return  {Object}                      Group objects
 */
export function generateGutsMeshPoint(
  size = 0.2,
  parts = [],
  isSimple = false,
  line = false,
  name = false
) {
  if (name) {
    return generateMeshPoint(
      size,
      parts.filter((item) =>
        Array.isArray(name) ? name.includes(item.name) : item.name == name
      ),
      isSimple,
      line
    );
  }

  const gutsParts = parts.filter((item) => item.name.includes("Guts"));

  const gutsPart = gutsParts[randomBetween(0, gutsParts.length - 1)];

  return generateMeshPoint(size, [gutsPart], isSimple, line);
}

export default generateGutsMeshPoint;
