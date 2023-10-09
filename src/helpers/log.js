/**
 * Log message
 *
 * @param   {String}  msg  Message
 *
 * @return  {Boolean}      Result
 */
export function log(msg) {
  if (arguments.length > 1) {
    console.debug(...arguments);
  } else {
    console.debug(msg);
  }

  return true;
}

/**
 * Log message with prefix helper
 *
 * @param   {String}  msg     Message
 * @param   {String}  prefix  Prefix
 *
 * @return  {Boolean}         Result
 */
export function logMsg(msg, prefix) {
  if (prefix?.length) {
    return log(`[${prefix}]:`, msg);
  }

  return log(msg);
}

export default log;
