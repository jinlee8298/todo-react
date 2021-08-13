import StyledMenu from "./Menu.style";
import MenuItem from "./Item/Item";
import MenuDivider from "./Divider.style";
import {
  FC,
  useEffect,
  useLayoutEffect,
  useState,
  MouseEventHandler,
  useRef,
  KeyboardEventHandler,
  MutableRefObject,
} from "react";
import FocusTrap from "focus-trap-react";
import { createPortal } from "react-dom";

type MenuProps = {
  open?: Boolean;
  handleClose?: Function;
  attachTo?: MutableRefObject<HTMLElement | null>;
};

type MenuType = FC<MenuProps> & {
  Item: typeof MenuItem;
  Divider: typeof MenuDivider;
};

const Menu: MenuType = (props) => {
  const [top, setTop] = useState("0");
  const [left, setLeft] = useState("0");
  const [render, setRender] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (props.open) {
      setRender(true);
    } else {
      listRef.current?.classList.remove("showing");
      setTimeout(() => setRender(false), 200);
    }
  }, [props.open]);

  useLayoutEffect(() => {
    if (props.attachTo?.current && listRef.current && render) {
      let { top, left } = calculateAttachPosition(
        props.attachTo.current,
        listRef.current
      );
      setTop(`${top}px`);
      setLeft(`${left}px`);
    }
    if (render) {
      listRef.current?.classList.add("showing");
    }
  }, [render, props.attachTo]);

  const calculateAttachPosition = (
    element: HTMLElement,
    attachElement: HTMLElement
  ) => {
    let eleRect = element.getBoundingClientRect();
    let attachRect = attachElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    let attachMiddle = attachRect.width / 2;
    if (eleRect.x > attachMiddle) {
      let elementMiddle = (eleRect.left + eleRect.right) / 2;
      if (elementMiddle + attachMiddle > window.innerWidth) {
        left = window.innerWidth - attachRect.width;
      } else {
        left = elementMiddle - attachMiddle;
      }
    }

    if (window.innerHeight - eleRect.bottom < attachRect.height) {
      top = window.innerHeight - attachRect.height;
    } else {
      top = eleRect.bottom + 5;
    }

    return {
      top,
      left,
    };
  };

  const onClickBackdrop: MouseEventHandler<HTMLDivElement> = (e) => {
    if (props.handleClose && e.target === e.currentTarget) {
      props.handleClose();
    }
  };

  const onPressEsc: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (["Escape"].includes(e.code)) {
      props.handleClose?.();
    }
  };

  return render
    ? createPortal(
        <FocusTrap>
          <StyledMenu
            top={top}
            left={left}
            onClick={onClickBackdrop}
            onKeyDown={onPressEsc}
          >
            <ul
              role="menu"
              ref={listRef}
              onAnimationEnd={(e) => console.log(e)}
            >
              {props.children}
            </ul>
          </StyledMenu>
        </FocusTrap>,
        document.body
      )
    : null;
};

Menu.Item = MenuItem;
Menu.Divider = MenuDivider;

export default Menu;
