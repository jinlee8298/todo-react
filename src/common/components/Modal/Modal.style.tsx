import styled from "styled-components";
import { transtionTiming, shadow } from "common/styles/common";

export default styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-block: 2em;
  transition: opacity 0.2s;
  ${transtionTiming};

  &.showing {
    section,
    .backdrop {
      opacity: 1;
      transform: scale(1);
    }
  }

  .backdrop {
    opacity: 0;
    background: var(--backdrop);
    transition: opacity 0.2s;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  section {
    ${shadow};
    width: 100%;
    max-width: 650px;
    max-height: 690px;
    overflow: hidden;
    background: #fff;
    transition: transform 0.2s, opacity 0.2s;
    opacity: 0;
    transform: scale(0.9);
    transform-origin: 50% 50%;
  }
`;
