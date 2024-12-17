/* eslint-disable no-unused-vars */
const useDebounce = <T extends any[], D>(
  cb: (..._argv: T) => D,
  delay: number = 500,
): ((..._argv: T) => void) => {
  let timer: null | number = null;
  return (..._argv: T) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      return cb(..._argv);
    }, delay);
  };
};
export default useDebounce;
