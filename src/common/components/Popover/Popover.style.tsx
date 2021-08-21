import { transtionTiming } from "common/styles/common";
import styled from "styled-components";

export default styled.div`
  position: fixed;
  top: var(--top);
  left: var(--left);

  transition: transform 0.2s, opacity 0.2s;
  transform-origin: var(--origin-x) var(--origin-y);
  ${transtionTiming};
  transform: scale(0.9);
  opacity: 0;

  &.showing {
    transform: scale(1);
    opacity: 1;
  }
`;
