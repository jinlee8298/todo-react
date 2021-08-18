import styled from "styled-components";
import { Button } from "common/components/style";
import TaskList from "../TaskSection/TaskSection.style";
import Placeholder from "../Placeholder/Placeholder.style";
import AddSectionButton from "../AddSectionButton/AddSectionButton.style";

export default styled.div`
  --list-width: 17rem;
  --primary-10: ${({ theme }) => theme.primary + "1A"};

  height: 100%;
  overflow-y: auto;
  display: flex;
  padding: 2rem;
  align-items: flex-start;

  > ${TaskList}, > ${Placeholder} {
    margin-inline-end: 1.5rem;
  }
  ${Placeholder} {
    width: calc(var(--list-width) + 2rem);
    flex-shrink: 0;
  }
  > ${Button} {
    flex-shrink: 0;
    width: calc(var(--list-width) + 2rem);
  }
  ${AddSectionButton} {
    position: relative;
    right: 0.75rem;
  }
  > .dropzone-padding {
    height: 100%;
    width: 2rem;
    margin-inline-start: -2rem;
    flex-shrink: 0;
  }
`;
