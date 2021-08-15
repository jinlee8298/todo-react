import { useState, useRef, MutableRefObject } from "react";

const useMenu = <T>(): [
  boolean,
  MutableRefObject<T | null>,
  () => void,
  () => void
] => {
  const [open, setOpen] = useState(false);
  const attachElementRef = useRef<T>(null);

  const openMenu = () => {
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return [open, attachElementRef, openMenu, closeMenu];
};

export default useMenu;
