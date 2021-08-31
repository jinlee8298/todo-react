import styled from "styled-components";
import SubTask from "../TaskDetailsModal/SubTasksTab/SubTask/SubTask.style";

export default styled.div`
  max-width: 50rem;
  margin-inline: auto;
  h1 {
    margin-block: 1rem;
  }
  ${SubTask} {
    border-block-end: 1px solid var(--gray3);
  }
`;
