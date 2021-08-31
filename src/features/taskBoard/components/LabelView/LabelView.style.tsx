import styled from "styled-components";
import SubTask from "../TaskDetailsModal/SubTasksTab/SubTask/SubTask.style";

export default styled.div`
  max-width: 50rem;
  margin-inline: auto;
  h1 {
    font-size: 1.5rem;
    margin-block: 1rem;
    display: flex;
    align-items: center;
    .color-indicator {
      background: var(--label-color);
      width: 0.5em;
      height: 1.5em;
      display: block;
      border-radius: 2px;
      margin-inline-end: 0.5em;
    }
  }
  ${SubTask} {
    border-block-end: 1px solid var(--gray3);
  }
`;
