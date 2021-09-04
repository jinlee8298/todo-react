import styled from "styled-components";
import { Modal } from "common/components";

export default styled(Modal)`
  padding: 0;
  align-items: flex-start;
  section {
    height: 100%;
    max-height: 100%;
    width: min(17.5rem, 100vw);
    transform: translateX(-100%);
    &.showing {
      transform: translateX(0);
    }
    > div {
      height: 44px;
      display: flex;
      align-items: center;
      background: var(--primary);
      justify-content: flex-end;
      padding-inline: 1.3125rem;
    }
  }

  nav {
    font-size: 0.875rem;
    height: 100%;
    overflow: auto;
  }
`;
