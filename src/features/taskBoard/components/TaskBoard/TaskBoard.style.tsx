import styled from "styled-components";
import { Button } from "common/components/style";
import TaskList from "../TaskSection/TaskSection.style";

export default styled.div`
  --list-width: 17rem;
  --primary-10: ${({ theme }) => theme.primary + "1A"};

  height: 100%;
  overflow-y: auto;
  display: flex;
  padding: 0.5rem;
  align-items: flex-start;
  ${TaskList} {
    margin-inline: 0.75rem;
    &:first-child {
      margin-inline-start: 0;
    }
    &:last-child {
      margin-inline-end: 0;
    }
  }
  > ${Button} {
    margin-inline-start: 0.75rem;
    flex-shrink: 0;
    width: var(--list-width);
  }
`;
