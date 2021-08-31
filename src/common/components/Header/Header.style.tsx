import { transitionTiming } from "common/styles/common";
import styled from "styled-components";
import NavBarStyle from "../NavBar/NavBar.style";

export default styled.header`
  background: var(--primary);
  display: flex;
  align-items: center;
  padding-inline: 1rem;
  .left-group {
    > * {
      margin-inline-end: 0.5rem;
    }
  }
  .toggle-nav {
    color: #fff;
    background: transparent;
    border: none;
    width: 1.5em;
    height: 1.5em;
    border-radius: 4px;
    font-size: 1rem;
    padding: 0;
    &:hover,
    &:focus {
      cursor: pointer;
      outline: none;
      background: #ffffff33;
    }
  }
  &.show-nav {
    ${NavBarStyle} {
      top: 44px;
      left: 0;
      transition: left 0.2s, visibility 0.2s step-start;
      visibility: visible;
    }
    & + main {
      margin-inline-start: 17.5rem;
    }
  }
  & + main {
    ${transitionTiming};
    transition: margin 0.2s;
  }
  ${NavBarStyle} {
    ${transitionTiming};
    position: absolute;
    top: 44px;
    left: -17.5rem;
    transition: left 0.2s, visibility 0.2s step-end;
    visibility: hidden;
  }
`;
