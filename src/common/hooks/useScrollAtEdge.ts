import { throttle } from "common/utilitites";
import { RefObject, useEffect, useRef } from "react";

type ScrollOptions = {
  threshold: number;
  intervalDistance: number;
};

type OptionType = {
  scrollX?: ScrollOptions;
  scrollY?: ScrollOptions;
};
/**
 * This hook only support for useDrag hook when dragging obj near container edge
 * @param {OptionType} options options obj for scroll behavior
 * @param {RefObject<boolean>} containerRef ref object of container element
 */
const useScrollAtEdge = <ContainerType extends HTMLElement>(
  options: OptionType = {},
  containerRef: RefObject<ContainerType> | null = null
) => {
  const autoScrollActive = useRef(true);

  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }

    const ref = containerRef.current;

    const disableAutoScroll = () => {
      autoScrollActive.current = false;
      ref.removeAttribute("style");
    };

    const enableAutoScroll = () => {
      autoScrollActive.current = true;
    };

    const autoScrollHandler = throttle((e: CustomEvent) => {
      const touch = e.detail.position;
      if (touch && autoScrollActive.current) {
        const { left, top, width, height } = ref.getBoundingClientRect();
        ref.style.overflow = "hidden";

        if (options.scrollX) {
          const scrollOption = options.scrollX;
          const x = touch.clientX - left;

          if (x > width - scrollOption.threshold) {
            ref.scrollLeft += scrollOption.intervalDistance;
          }
          if (x < scrollOption.threshold) {
            ref.scrollLeft -= scrollOption.intervalDistance;
          }
        }

        if (options.scrollY) {
          const scrollOption = options.scrollY;
          const y = touch.clientY - top;

          if (y > height - scrollOption.threshold) {
            ref.scrollTop += scrollOption.intervalDistance;
          }
          if (y < scrollOption.threshold) {
            ref.scrollTop -= scrollOption.intervalDistance;
          }
        }
      }
    }, 50);

    ref.addEventListener("custom-dragend", disableAutoScroll);
    ref.addEventListener("custom-dragleave", disableAutoScroll);
    ref.addEventListener("custom-dragstart", enableAutoScroll);
    ref.addEventListener("custom-dragenter", enableAutoScroll);
    ref.addEventListener("custom-dragover", autoScrollHandler);
    return () => {
      ref.removeEventListener("custom-dragend", disableAutoScroll);
      ref.removeEventListener("custom-dragleave", disableAutoScroll);
      ref.removeEventListener("custom-dragstart", enableAutoScroll);
      ref.removeEventListener("custom-dragenter", enableAutoScroll);
      ref.removeEventListener("custom-dragover", autoScrollHandler);
    };
  }, [containerRef, options]);
};

export default useScrollAtEdge;
