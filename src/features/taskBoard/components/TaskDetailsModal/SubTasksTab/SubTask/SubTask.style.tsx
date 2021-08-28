import styled from "styled-components";
import Task from "features/taskBoard/components/Task/Task.style";
import { Button } from "common/components/style";

export default styled(Task)`
  box-shadow: none;
  border-radius: 0;
  border: none;
  padding: 1em 2rem;
  &.finished {
    h3 {
      text-decoration: line-through;
      color: var(--gray1);
    }
  }
  &:hover,
  &:focus-within {
    background: var(--gray4);
  }
  h3 {
    font-weight: normal;
  }
  > ${Button} {
    position: absolute;
    right: 1em;
    top: 1em;
  }
`;
