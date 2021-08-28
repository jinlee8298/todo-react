import { NavBar } from "common/components/style";
import { transitionTiming } from "common/styles/common";
import TaskBoard from "features/taskBoard/components/TaskBoard/TaskBoard.style";
import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  header {
    flex-basis: 44px;
    flex-shrink: 0;
  }
  main {
    position: relative;
    flex: 1;
    flex-basis: 0px;
    overflow: hidden;
    ${NavBar} {
      ${transitionTiming};
      left: -17.5rem;
      transition: all 0.2s;
      visibility: hidden;
    }
    ${TaskBoard} {
      ${transitionTiming};
      transition: all 0.2s;
    }
    &.show-nav {
      ${TaskBoard} {
        margin-inline-start: 17.5rem;
      }
      ${NavBar} {
        left: 0;
        visibility: visible;
      }
    }
  }
`;
