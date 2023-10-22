import { Vector3 } from "three";

/**
 * Get world position helper
 *
 * @param   {Object}   item           Item
 * @param   {Boolean}  [force=false]  Force get flag
 *
 * @return  {Object}                  World position vector
 */
export function getWorldPosisition(item, force = false) {
  const itemPosition = new Vector3(0, 0, 0);
  item.getWorldPosition(itemPosition);

  // Save current local position for cache use
  item.userData.position = { ...item.position };

  // Save global position
  item.userData.globalPosition = itemPosition;

  return itemPosition;
}

export default getWorldPosisition;
