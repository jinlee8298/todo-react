import { EntityId } from "@reduxjs/toolkit";

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

export const generateUID = (): EntityId => {
  const timeStamp = Date.now().toString();
  const randomNum = (Math.random() * (1000 - 100) + 100).toFixed();
  return timeStamp + randomNum;
};
