import StyledMenu from "./Menu.style";
import MenuItem from "./Item/Item";
import MenuDivider from "./Divider.style";
import { FC, MouseEventHandler, useEffect, useRef } from "react";
import FocusTrap from "focus-trap-react";

type MenuType = FC & {
  Item: typeof MenuItem;
  Divider: typeof MenuDivider;
};

const Menu: MenuType = (props) => {
  const menuContainerRef = useRef<HTMLUListElement>(null);
  const childRefs = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef<number>(0);

  useEffect(() => {
    const currentMenuRef = menuContainerRef.current;

    const menuChilds: HTMLLIElement[] = [];
    if (currentMenuRef) {
      currentMenuRef
        .querySelectorAll<HTMLLIElement>('[role="menuitem"]:not(:disabled)')
        .forEach((child) => menuChilds.push(child));
    }
    childRefs.current = menuChilds;

    const moveUp = () => {
      const currentIndex = currentFocusIndex.current;
      if (currentIndex > 0) {
        childRefs.current[currentIndex - 1].focus();
      } else {
        childRefs.current[childRefs.current.length - 1].focus();
      }
    };

    const moveDown = () => {
      const currentIndex = currentFocusIndex.current;
      if (currentIndex < childRefs.current.length - 1) {
        childRefs.current[currentIndex + 1].focus();
      } else {
        childRefs.current[0].focus();
      }
    };

    const childFocused = (e: FocusEvent) => {
      currentFocusIndex.current = childRefs.current.indexOf(
        e.target as HTMLLIElement
      );
    };

    const onKeypress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (!childRefs.current.includes(target)) {
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveDown();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveUp();
      }

      if (e.key === "Home") {
        e.preventDefault();
        childRefs.current[0].focus();
      }

      if (e.key === "End") {
        e.preventDefault();
        childRefs.current[childRefs.current.length - 1].focus();
      }
    };

    currentMenuRef?.addEventListener("keydown", onKeypress);

    childRefs.current.forEach((child) =>
      child.addEventListener("focus", childFocused)
    );

    return () => {
      childRefs.current.forEach((child) =>
        child.removeEventListener("focus", childFocused)
      );
      currentMenuRef?.removeEventListener("keydown", onKeypress);
    };
  }, [menuContainerRef]);

  const stopPropagation: MouseEventHandler<HTMLUListElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <FocusTrap>
      <StyledMenu ref={menuContainerRef} role="menu" onClick={stopPropagation}>
        {props.children}
      </StyledMenu>
    </FocusTrap>
  );
};

Menu.Item = MenuItem;
Menu.Divider = MenuDivider;

export default Menu;
