import styled from "styled-components";
import { Button } from "common/components/style";
import TaskList from "../TaskSection/TaskSection.style";
import Placeholder from "../Placeholder/Placeholder.style";
import AddSectionButton from "../AddSectionButton/AddSectionButton.style";
import TaskSectionEditor from "../TaskSection/TaskSectionEditor/TaskSectionEditor.style";

export default styled.div`
  --list-width: 17rem;
  --primary-10: ${({ theme }) => theme.primary + "1A"};

  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;

  h1 {
    font-size: 1.5rem;
    margin-block-end: 0.5em;
    flex-shrink: 0;
    padding-inline: 2rem;
    margin-block: 1rem;
  }

  [role="listbox"] {
    flex: 1;
    flex-basis: 0px;
    padding-inline: 2rem;
    padding-block-end: 1rem;
    display: flex;
    align-items: flex-start;
    overflow: auto;
    > ${TaskList}, > ${Placeholder}, > ${TaskSectionEditor} {
      margin-inline-end: 1.5rem;
    }
    > ${Placeholder} {
      width: calc(var(--list-width) + 2rem);
      flex-shrink: 0;
    }
    > ${Button}, > ${TaskSectionEditor} {
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
  }
`;
