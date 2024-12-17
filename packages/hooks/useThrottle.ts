const useThrottle = <T extends any[], D>(
  cb: (..._argv: T) => D,
  delay: number = 500,
): ((..._argv: T) => void) => {
  let timer: null | number = null;
  return (..._argv: T) => {
    if (timer) {
      return;
    }
    cb(..._argv);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
};
export default useThrottle;
