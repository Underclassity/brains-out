/**
 * Log message
 *
 * @param   {String}  msg  Message
 *
 * @return  {Boolean}      Result
 */
export function log(msg) {
  console.debug.call(this, ...arguments);
  return true;
}

export default log;
