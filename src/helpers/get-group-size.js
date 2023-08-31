import { Box3, Vector3 } from "three";

/**
 * Get group size
 *
 * @param   {Object}  group  Group
 *
 * @return  {Object}         Vector3 size
 */
export function getGroupSize(group) {
  const box = new Box3().setFromObject(group, true);
  const size = new Vector3();
  box.getSize(size);

  return size;
}

export default getGroupSize;
