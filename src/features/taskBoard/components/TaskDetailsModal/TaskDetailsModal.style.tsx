import styled from "styled-components";
import { Modal } from "common/components";
import { Checkbox, Button, Tabs } from "common/components/style";
import TaskEditor from "features/taskBoard/components/TaskEditor/TaskEditor.style";
import LabelStyle from "common/components/Label/Label.style";

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
      flex: 1;
      overflow: hidden;
      padding-inline-end: 0.5em;

      &:focus,
      &:hover {
        color: var(--primary);
        font-weight: bold;
      }

      span {
        flex: 1;
        display: block;
        flex-basis: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      svg {
        flex-shrink: 0;
        width: 20px;
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
      height: 1.5rem;
      margin-inline-end: 1rem;
    }
    &.finished {
      h4 {
        color: var(--gray1);
        text-decoration: line-through;
      }
    }
    .editable {
      flex: 1;
      max-height: 10rem;
      overflow: auto;
      p {
        white-space: break-spaces;
      }
      &:focus {
        outline: none;
        box-shadow: inset 0 0 0 1px var(--primary);
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
  .edit-task {
    ${TaskEditor} {
      padding: 0;
    }
    > .label-wrapper {
      display: flex;
      flex-wrap: wrap;
      margin-block-start: 0.5rem;
      margin-inline-start: 2.25rem;
      ${LabelStyle} {
        flex-shrink: 0;
        margin-block-end: 0.5em;
        &:not(:last-child) {
          margin-inline-end: 0.5em;
        }
      }
    }
  }
`;
