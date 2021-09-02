import {
  MouseEventHandler,
  RefObject,
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

const useDrag = <ContainerType extends HTMLElement>(
  options: DragOption = {}
) => {
  const containerRef = useRef<ContainerType>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const mouseDownInitialPos = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown: MouseEventHandler = (e) => {
    if (!options.preventDrag) {
      mouseDownInitialPos.current = { x: e.clientX, y: e.clientY };
      setDragging(true);
    }
  };

  const onMouseUp: MouseEventHandler = () => {
    setDragging(false);
  };

  const handleDragStart = (dragEle: HTMLElement) => {
    const initialPos = mouseDownInitialPos.current;
    if (initialPos) {
      const rect = dragEle.getBoundingClientRect();
      const x = initialPos.x - rect.left;
      const y = initialPos.y - rect.top;
      const height = dragEle.offsetHeight;
      const width = dragEle.offsetWidth;

      dragEle.style.setProperty("--offset-x", `${width - x}px`);
      dragEle.style.setProperty("--offset-y", `${height - y}px`);
      dragEle.style.setProperty("height", `${height}px`);
      dragEle.style.setProperty("top", `-${height}px`);
      dragEle.style.setProperty("left", `-${width}px`);
      dragEle.style.setProperty("transition", `none`);
      dragEle.classList.add("dragging");
    }
  };

  const handleDragEnd = (dragEle: HTMLElement) => {
    dragEle.classList.remove("dragging");
    dragEle.removeAttribute("style");
  };

  useEffect(() => {
    if (dragging) {
      let isDragging = false;
      const startDrag = () => {
        if (containerRef.current) {
          options.onDragStart?.(containerRef.current);
          handleDragStart(containerRef.current);
        }
      };
      const endDrag = () => {
        containerRef.current && handleDragEnd(containerRef.current);
        isDragging = false;
        mouseDownInitialPos.current = null;
        containerRef.current && options.onDragEnd?.(containerRef.current);
      };
      const onBodyMouseMove = (e: MouseEvent) => {
        const initialPos = mouseDownInitialPos.current;
        if (initialPos) {
          const x = e.clientX;
          const y = e.clientY;
          const xMoved = initialPos.x >= x + 10 || initialPos.x < x - 10;
          const yMoved = initialPos.y >= y + 10 || initialPos.y < y - 10;
          if (xMoved || yMoved) {
            if (!isDragging) {
              isDragging = true;
              startDrag();
            }
            if (isDragging) {
              containerRef.current?.style.setProperty("--top", `${y}px`);
              containerRef.current?.style.setProperty("--left", `${x}px`);
            }
          }
        }
      };
      const onBodyMouseUp = () => {
        endDrag();
        setDragging(false);
      };

      document.addEventListener("mousemove", onBodyMouseMove);
      document.addEventListener("mouseup", onBodyMouseUp);
      return () => {
        document.removeEventListener("mousemove", onBodyMouseMove);
        document.removeEventListener("mouseup", onBodyMouseUp);
      };
    }
  }, [dragging, containerRef, options]);

  return [dragging, containerRef, { onMouseDown, onMouseUp }] as [
    dragging: boolean,
    containerRef: RefObject<ContainerType>,
    containerProps: {
      onMouseDown: MouseEventHandler;
      onMouseUp: MouseEventHandler;
    }
  ];
};

export default useDrag;
