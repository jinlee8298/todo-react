import { NavBar } from "common/components";
import { Button } from "common/components/style";
import styled from "styled-components";

export default styled(NavBar.NavGroup)`
  .nav-item {
    &:hover,
    &:focus-within {
      ${Button} {
        display: block;
      }
    }
    ${Button} {
      display: none;
      position: absolute;
      right: 1.3125rem; // 0.875rem * 1.5rem
      top: 50%;
      transform: translateY(-50%);
      &.showing {
        display: block;
      }
    }
  }
`;
