import styled from "styled-components";
import Task from "features/taskBoard/components/Task/Task.style";

export default styled(Task)`
  box-shadow: none;
  border-radius: 0;
  border: none;
  padding: 1em 2rem;
  &:hover,
  &:focus-within {
    background: var(--gray4);
  }
  h3 {
    font-weight: normal;
  }
`;
