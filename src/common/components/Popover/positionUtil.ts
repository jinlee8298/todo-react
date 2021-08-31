enum Position {
  TOP,
  BOTTOM,
  RIGHT,
  LEFT,
}

const PADDING = 5;

const getAttachPoint = (
  targetElementRect: DOMRect,
  attachElement: HTMLElement,
  position: Position = Position.BOTTOM
) => {
  const { top, left, bottom, right, width, height } = targetElementRect;
  const { offsetHeight: attachHeight, offsetWidth: attachWidth } =
    attachElement;
  let x = 0;
  let y = 0;
  let attachLeft = 0;
  let attachTop = 0;

  switch (position) {
    case Position.BOTTOM:
      x = left + width / 2;
      y = bottom;
      attachTop = y + PADDING;
      attachLeft = x - attachWidth / 2;
      break;
    case Position.TOP:
      x = left + width / 2;
      y = top;
      attachTop = y - attachHeight - PADDING;
      attachLeft = x - attachWidth / 2;
      break;
    case Position.LEFT:
      x = left;
      y = top + height / 2;
      attachTop = y - attachHeight / 2;
      attachLeft = x - attachWidth - PADDING;
      break;
    case Position.RIGHT:
      x = right;
      y = top + height / 2;
      attachTop = y - attachHeight / 2;
      attachLeft = x + PADDING;
      break;
  }

  return { top: attachTop, left: attachLeft };
};

const calculateAttachPosition = (
  targetElement: HTMLElement,
  attachElement: HTMLElement,
  position: Position = Position.BOTTOM
) => {
  const targetRect = targetElement.getBoundingClientRect();
  const { offsetHeight: attachHeight, offsetWidth: attachWidth } =
    attachElement;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let attachPosition = position;

  switch (position) {
    case Position.LEFT: {
      attachPosition =
        attachWidth <= targetRect.left ? Position.LEFT : Position.RIGHT;
      break;
    }
    case Position.RIGHT: {
      attachPosition =
        attachWidth <= viewportWidth - targetRect.right
          ? Position.RIGHT
          : Position.LEFT;
      break;
    }
    case Position.TOP: {
      attachPosition =
        attachHeight <= targetRect.top ? Position.TOP : Position.BOTTOM;

      break;
    }
    case Position.BOTTOM: {
      attachPosition =
        attachHeight >= viewportHeight - targetRect.bottom
          ? Position.TOP
          : Position.BOTTOM;
      break;
    }
  }

  let { top, left } = getAttachPoint(targetRect, attachElement, attachPosition);

  if (top + attachHeight > viewportHeight) {
    top = viewportHeight - attachHeight;
  }
  if (top < 0) {
    top = 0;
  }
  if (left + attachWidth > viewportWidth) {
    left = viewportWidth - attachWidth;
  }
  if (left < 0) {
    left = 0;
  }

  return {
    top,
    left,
    transformOrigin: {
      x: attachElement.offsetWidth / 2,
      y: attachElement.offsetHeight / 2,
    },
  };
};

export { calculateAttachPosition, getAttachPoint, PADDING, Position };
