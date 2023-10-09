/**
 * Throttle helper
 *
 * @param   {Function}  callee         Call function
 * @param   {Number}    [timeout=250]  Timeout count in ms
 *
 * @return  {Boolean}                  Result
 */
export function throttle(callee, timeout = 250) {
  let timer = null;

  return function perform(...args) {
    if (timer) return false;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

export default throttle;
