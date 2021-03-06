import { throttle } from "common/utilitites";
import {
  MouseEventHandler,
  RefObject,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { css } from "styled-components";

export const placeholderStyle = css`
  .placeholder {
    border-radius: 8px;
    background: var(--gray2);
  }
  .dragging {
    position: fixed !important;
    z-index: 10;
    pointer-events: none;
    transform: translate(
        calc(var(--left) + var(--offset-x)),
        calc(var(--top) + var(--offset-y))
      )
      rotate(5deg);
  }
`;

type DragOption = {
  onDragStart?: (dragEle: HTMLElement) => void;
  onDragEnd?: (dragEle: HTMLElement) => void;
  preventDrag?: boolean;
};

/**
 * This hook use to make Element draggable using mouse and touch event
 * instead of native HTML5 drag&drop api. Why? Because the way HTML5 drag&drop
 * works is confusing and unexpected.
 * @param {DragOption} options options obj for drag behavior including event onDragStart, onDragEnd and preventDrag flag
 * @returns an array that include dragging state, drag element ref object, event props for drag element respectively
 */

const useDrag = <ContainerType extends HTMLElement>(
  options: DragOption = {}
) => {
  const containerRef = useRef<ContainerType>(null);
  const isTouchRef = useRef(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const mouseDownInitialPos = useRef<{
    x: number;
    y: number;
    xPosRelativeToEle: number;
    yPosRelativeToEle: number;
  } | null>(null);

  const calculateInitialPos = (
    clientX: number,
    clientY: number,
    currentTarget: Element
  ) => {
    const rect = currentTarget.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    return {
      x: clientX,
      y: clientY,
      xPosRelativeToEle: offsetX,
      yPosRelativeToEle: offsetY,
    };
  };

  const onMouseDown: MouseEventHandler = (e) => {
    if (!options.preventDrag) {
      mouseDownInitialPos.current = calculateInitialPos(
        e.clientX,
        e.clientY,
        e.currentTarget
      );
      setDragging(true);
    }
  };

  const endDragging = () => {
    setDragging(false);
    isTouchRef.current = false;
  };

  const onTouchStart: TouchEventHandler = (e) => {
    if (!options.preventDrag) {
      const initialPos = e.touches[0];
      mouseDownInitialPos.current = calculateInitialPos(
        initialPos.clientX,
        initialPos.clientY,
        e.currentTarget
      );
      setDragging(true);
      isTouchRef.current = true;
    }
  };

  const handleDragStart = (dragEle: HTMLElement) => {
    const initialPos = mouseDownInitialPos.current;
    if (initialPos) {
      const height = dragEle.offsetHeight;
      const width = dragEle.offsetWidth;

      dragEle.style.setProperty(
        "--offset-x",
        `${width - initialPos.xPosRelativeToEle}px`
      );
      dragEle.style.setProperty(
        "--offset-y",
        `${height - initialPos.yPosRelativeToEle}px`
      );
      dragEle.style.setProperty("height", `${height}px`);
      dragEle.style.setProperty("top", `-${height}px`);
      dragEle.style.setProperty("left", `-${width}px`);
      dragEle.style.setProperty("transition", "none");
      dragEle.classList.add("dragging");
      dragEle.dispatchEvent(
        new CustomEvent("custom-dragstart", { bubbles: true })
      );
    }
  };

  const handleDragEnd = (dragEle: HTMLElement) => {
    dragEle.classList.remove("dragging");
    dragEle.removeAttribute("style");
    dragEle.dispatchEvent(new CustomEvent("custom-dragend", { bubbles: true }));
  };

  const dispatchEventHandler = (
    prevDragOverElements: Element[],
    currentDragOverElements: Element[],
    position: { clientX: number; clientY: number }
  ) => {
    currentDragOverElements.forEach((ele) => {
      ele.dispatchEvent(
        new CustomEvent("custom-dragover", {
          detail: {
            position: { clientX: position.clientX, clientY: position.clientY },
          },
          bubbles: true,
        })
      );

      const prevIndex = prevDragOverElements.indexOf(ele as HTMLElement);
      if (prevIndex === -1) {
        ele.dispatchEvent(new CustomEvent("custom-dragenter"));
      } else {
        prevDragOverElements.splice(prevIndex, 1);
      }
    });
    prevDragOverElements.forEach((dragLeaveEle) =>
      dragLeaveEle.dispatchEvent(new CustomEvent("custom-dragleave"))
    );
    return currentDragOverElements as Element[];
  };

  useEffect(() => {
    if (dragging) {
      let waitingToStartDrag: null | ReturnType<typeof setTimeout> = null;
      let isDragging = false;
      let prevDragOverElements: Element[] = [];

      if (isTouchRef.current) {
        waitingToStartDrag = setTimeout(() => {
          window.navigator.vibrate(50);
          waitingToStartDrag = null;
        }, 1000);
      }

      const startDrag = () => {
        if (containerRef.current) {
          options.onDragStart?.(containerRef.current);
          handleDragStart(containerRef.current);
        }
      };
      const endDrag = () => {
        if (isDragging) {
          if (containerRef.current) {
            handleDragEnd(containerRef.current);
            options.onDragEnd?.(containerRef.current);
          }
          isDragging = false;
          mouseDownInitialPos.current = null;
        }
      };
      const calculateDragPosition = (
        x: number,
        y: number,
        skipThreshold: boolean = false
      ) => {
        const initialPos = mouseDownInitialPos.current;
        if (initialPos) {
          if (!skipThreshold) {
            const xMoved = initialPos.x >= x + 10 || initialPos.x < x - 10;
            const yMoved = initialPos.y >= y + 10 || initialPos.y < y - 10;
            if (!xMoved && !yMoved) {
              return;
            }
          }
          if (!isDragging) {
            isDragging = true;
            startDrag();
          }
          if (isDragging) {
            containerRef.current?.style.setProperty("--top", `${y}px`);
            containerRef.current?.style.setProperty("--left", `${x}px`);
          }
        }
      };
      const onBodyMouseMove = throttle((e: MouseEvent) => {
        calculateDragPosition(e.clientX, e.clientY);
        if (isDragging) {
          const dragOverElements = e.composedPath();
          prevDragOverElements = dispatchEventHandler(
            prevDragOverElements,
            dragOverElements as Element[],
            { clientX: e.clientX, clientY: e.clientY }
          );
        }
      }, 16);
      const onBodyTouchMove = throttle((e: TouchEvent) => {
        if (!waitingToStartDrag) {
          const clientX = e.touches[0].clientX;
          const clientY = e.touches[0].clientY;
          calculateDragPosition(clientX, clientY, true);

          if (isDragging) {
            const dragOverElements = document.elementsFromPoint(
              clientX,
              clientY
            );
            prevDragOverElements = dispatchEventHandler(
              prevDragOverElements,
              dragOverElements as Element[],
              { clientX, clientY }
            );
          }
        }
      }, 16);

      const stopDragging = () => {
        endDrag();
        setDragging(false);
      };

      document.addEventListener("mousemove", onBodyMouseMove);
      document.addEventListener("mouseup", stopDragging);
      document.addEventListener("touchmove", onBodyTouchMove);
      document.addEventListener("touchend", stopDragging);
      return () => {
        waitingToStartDrag && clearTimeout(waitingToStartDrag);
        document.removeEventListener("mousemove", onBodyMouseMove);
        document.removeEventListener("mouseup", stopDragging);
        document.removeEventListener("touchmove", onBodyTouchMove);
        document.removeEventListener("touchend", stopDragging);
      };
    }
  }, [dragging, containerRef, options]);

  return [
    dragging,
    containerRef,
    {
      onMouseDown,
      onMouseUp: endDragging,
      onTouchStart,
      onTouchEnd: endDragging,
    },
  ] as [
    dragging: boolean,
    containerRef: RefObject<ContainerType>,
    containerProps: {
      onMouseDown: MouseEventHandler;
      onMouseUp: MouseEventHandler;
      onTouchStart: TouchEventHandler;
      onTouchEnd: TouchEventHandler;
    }
  ];
};

export default useDrag;
