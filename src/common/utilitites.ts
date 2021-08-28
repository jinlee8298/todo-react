export const debounce = (func: Function, debounceTime: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  return function debouncedFunc(...args: any[]) {
    const callLater = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(callLater, debounceTime);
  };
};
