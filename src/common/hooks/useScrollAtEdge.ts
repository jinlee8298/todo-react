import { throttle } from "common/utilitites";
import { RefObject, useEffect } from "react";

// deactive properties is RefObject in order to
// prevent rerender when it change value
type ScrollOptions = {
  threshold: number;
  intervalDistance: number;
  deactive?: RefObject<boolean>;
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
  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }

    const ref = containerRef.current;

    const onTouchEnd = () => {
      ref.removeAttribute("style");
    };

    const onTouchMove = throttle((e: CustomEvent) => {
      const touch = e.detail.touchPos;
      const deactiveX = !options.scrollX || options.scrollX.deactive?.current;
      const deactiveY = !options.scrollY || options.scrollY.deactive?.current;
      const deactive = deactiveX && deactiveY;
      if (touch && !deactive) {
        const { left, top, width, height } = ref.getBoundingClientRect();
        ref.style.overflow = "hidden";

        if (options.scrollX && !deactiveX) {
          const scrollOption = options.scrollX;
          const x = touch.clientX - left;

          if (x > width - scrollOption.threshold) {
            ref.scrollLeft += scrollOption.intervalDistance;
          }
          if (x < scrollOption.threshold) {
            ref.scrollLeft -= scrollOption.intervalDistance;
          }
        }

        if (options.scrollY && !deactiveY) {
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

    ref.addEventListener("touchend", onTouchEnd);
    ref.addEventListener("touchover", onTouchMove);
    return () => {
      ref.removeEventListener("touchend", onTouchEnd);
      ref.removeEventListener("touchover", onTouchMove);
    };
  }, [containerRef, options]);
};

export default useScrollAtEdge;
