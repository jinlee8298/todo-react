import FocusTrap from "focus-trap-react";
import {
  FC,
  useState,
  useRef,
  cloneElement,
  ReactElement,
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import StyledPopover, { PopoverStyleProps } from "./Popover.style";
import { calculateAttachPosition, Position } from "./positionUtil";

type PopoverProps = {
  children?: ReactElement;
  closeOnClickOutside?: boolean;
  content?:
    | ReactElement
    | ((arg: { open: () => void; close: () => void }) => ReactElement);
  isShown?: boolean;
  position?: Position;
  trigger?: "click" | "hover";
  getPopoverRef?: (
    popoverRef: HTMLDivElement | null,
    targetRef: HTMLElement | null
  ) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onClickOutside?: () => void;
  onOpenFinished?: () => void;
  onCloseFinished?: () => void;
};

const Popover: FC<PopoverProps> = ({
  children,
  closeOnClickOutside,
  content,
  position = Position.BOTTOM,
  trigger = "click",
  onOpen,
  onClose,
  getPopoverRef,
  onClickOutside,
  onOpenFinished,
  onCloseFinished,
  ...props
}) => {
  const [isShown, setIsShown] = useState<boolean>(!!props.isShown);
  const [popoverPosition, setPopoverPosition] = useState<PopoverStyleProps>({
    top: 0,
    left: 0,
    transformOrigin: { x: 0, y: 0 },
  });
  const [render, setRender] = useState<boolean>(false);
  const targetRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const onCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (isShown) {
      return;
    }

    setIsShown(true);
    onOpen?.();
  }, [isShown, onOpen]);

  const close = useCallback(() => {
    if (!isShown) {
      return;
    }

    setIsShown(false);
    onClose?.();
  }, [isShown, onClose]);

  const togglePopover = useCallback(() => {
    isShown && typeof props.isShown !== "boolean" ? close() : open();
  }, [isShown, props.isShown, close, open]);

  const handleOpenHover = useMemo(() => {
    return trigger === "hover" ? open : undefined;
  }, [trigger, open]);

  const handleCloseHover = useMemo(() => {
    return trigger === "hover" ? close : undefined;
  }, [trigger, close]);

  useEffect(() => {
    if (typeof props.isShown !== "boolean" || props.isShown === isShown) {
      return;
    }

    props.isShown ? open() : close();
  }, [props.isShown, isShown, open, close]);

  useEffect(() => {
    const handleBodyClick = (event: MouseEvent) => {
      if (
        targetRef.current &&
        targetRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (
        popoverRef.current &&
        popoverRef.current.contains(event.target as Node)
      ) {
        return;
      }

      if (closeOnClickOutside && typeof props.isShown !== "boolean") {
        togglePopover();
      }

      onClickOutside?.();
    };

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        togglePopover();
      }
    };

    if (isShown) {
      document.body.addEventListener("mousedown", handleBodyClick);
      document.body.addEventListener("keydown", onEsc);
    }
    return () => {
      document.body.removeEventListener("mousedown", handleBodyClick);
      document.body.removeEventListener("keydown", onEsc);
    };
  }, [
    isShown,
    props.isShown,
    closeOnClickOutside,
    togglePopover,
    onClickOutside,
  ]);

  useEffect(() => {
    onCloseTimeout.current && clearTimeout(onCloseTimeout.current);
    if (isShown) {
      setRender(true);
      setTimeout(
        () => popoverRef.current && popoverRef.current.classList.add("showing")
      );
    } else {
      popoverRef.current && popoverRef.current.classList.remove("showing");
      onCloseTimeout.current = setTimeout(() => setRender(false), 200);
    }
  }, [isShown, props.isShown]);

  useEffect(() => {
    if (render && targetRef.current && popoverRef.current) {
      setPopoverPosition(
        calculateAttachPosition(targetRef.current, popoverRef.current, position)
      );
    }
  }, [render, position]);

  useLayoutEffect(() => {
    if (render) {
      onOpenFinished?.();
    } else {
      onCloseFinished?.();
    }
  }, [render, onOpenFinished, onCloseFinished]);

  const renderContent = cloneElement(children as ReactElement, {
    ref: targetRef,
    onClick: togglePopover,
    onMouseEnter: handleOpenHover,
  });

  const getRef = useCallback(
    (e: HTMLDivElement) => {
      popoverRef.current = e;
      getPopoverRef?.(e, targetRef.current);
    },
    [getPopoverRef]
  );

  return (
    <>
      {renderContent}
      {render &&
        createPortal(
          <>
            <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
              <StyledPopover
                {...popoverPosition}
                onMouseLeave={handleCloseHover}
                ref={getRef}
              >
                {typeof content === "function"
                  ? content({ open, close })
                  : content}
              </StyledPopover>
            </FocusTrap>
          </>,
          document.getElementById("popover-container") || document.body
        )}
    </>
  );
};
export default Popover;
