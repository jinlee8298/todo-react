import { shadow2 } from "common/styles/shadows";
import { transtionTiming } from "common/styles/common";
import styled from "styled-components";

export type PopoverStyleProps = {
  top: number;
  left: number;
  transformOrigin: { x: number; y: number };
};

export default styled.div<PopoverStyleProps>`
  ${shadow2}

  background: #fff;

  position: fixed;
  top: ${(props) => `${props.top}px`};
  left: ${(props) => `${props.left}px`};

  transition: transform 0.2s, opacity 0.2s;
  transform-origin: ${({ transformOrigin }) =>
    `${transformOrigin.x}px ${transformOrigin.y}px`};
  ${transtionTiming};
  transform: scale(0.9);
  opacity: 0;

  &.showing {
    transform: scale(1);
    opacity: 1;
  }
`;
