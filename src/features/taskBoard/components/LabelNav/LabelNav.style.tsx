import { NavBar } from "common/components";
import { Button } from "common/components/style";
import styled from "styled-components";

export default styled(NavBar.NavGroup)`
  .nav-item {
    padding-block: 0.5em;
    padding-inline: 1.5rem 3.5em;
    &:hover,
    &:focus-within {
      ${Button} {
        display: block;
      }
    }
    ${Button} {
      display: none;
      position: absolute;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
      &.showing {
        display: block;
      }
    }
  }
`;
