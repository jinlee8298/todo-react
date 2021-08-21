import styled from "styled-components";
import { Modal } from "common/components";
import { Checkbox, Button, Tabs } from "common/components/style";
import TaskEditor from "features/taskBoard/components/TaskEditor/TaskEditor.style";

export default styled(Modal)`
  > section {
    border-radius: 8px;
    padding: 1rem;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    a {
      font-size: 0.8rem;
      color: var(--gray1);
      display: flex;
      align-items: center;
      text-decoration: none;
      outline: none;
      &:focus {
        color: var(--primary);
        font-weight: bold;
      }
      svg {
        flex-shrink: 0;
        width: 20px;
        font-size: 0.5rem;
        margin-inline-end: 1rem;
      }
    }
  }
  .task-details {
    display: flex;
    align-items: flex-start;
    h4 {
      margin: 0;
      margin-block-end: 0.5em;
    }
    ${Checkbox} {
      flex-shrink: 0;
      height: 24px;
      margin-inline-end: 1rem;
    }
    .editable {
      flex: 1;
      p {
        white-space: break-spaces;
      }
      &:hover {
        cursor: text;
      }
    }
  }
  .task-actions {
    display: flex;
    justify-content: flex-end;
    ${Button} {
      margin-inline-start: 1em;
    }
  }
  ${Tabs} {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .tab-list {
      flex-shrink: 0;
    }
    .tab-container {
      flex: 1;
      overflow: auto;
      > section {
        height: 100%;
        overflow: auto;
      }
    }
  }

  ${TaskEditor} {
    padding: 0;
  }
`;
