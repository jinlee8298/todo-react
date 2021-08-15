import styled from "styled-components";
import { shadow } from "common/styles/shadows";

type MenuStyleProps = {
  top: string;
  left: string;
};

export default styled.div<MenuStyleProps>`
  --top: ${(props) => props.top};
  --left: ${(props) => props.left};

  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;

  ul {
    ${shadow};
    background: #fff;
    border-radius: 10px;
    left: var(--left);
    list-style: none;
    margin: 0;
    max-height: 100%;
    padding: 0.5rem 0;
    position: fixed;
    top: var(--top);
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    transform: translateY(-1em);
    &.showing {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
