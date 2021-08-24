import styled from "styled-components";
import { Button } from "common/components/style";
import TaskSectionEditor from "./TaskSectionEditor/TaskSectionEditor.style";

export default styled.section`
  --primary-10: ${(props) => `${props.theme.primary}0D`};
  --primary-70: ${(props) => `${props.theme.primary}B3`};

  border-radius: 8px;
  border: 1px solid var(--gray2);
  display: flex;
  flex-direction: column;
  max-height: 100%;
  width: calc(var(--list-width) + 2rem);
  flex-shrink: 0;

  &.dragging {
    display: none;
  }

  header {
    border-radius: 8px 8px 0 0;
    padding: 0.5em 1em;
    border-bottom: 1px solid var(--gray2);
    display: flex;
    align-items: center;
    background: #fff;
    h3 {
      font-size: 1rem;
      color: var(--text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: bold;
      &:hover {
        cursor: text;
      }
    }
    > span {
      font-size: 0.8rem;
      margin-inline: 0.5em;
      font-weight: bold;
      padding: 0.15em 0.45em;
      color: var(--text);
      background: var(--gray3);
      border-radius: 100rem;
      margin-inline-start: auto;
    }
    ${TaskSectionEditor} {
      padding: 0.5em 0;
    }
  }
  footer {
    flex-shrink: 0;
    > ${Button} {
      width: 100%;
      border: 1px solid transparent;
      border-top: 1px solid var(--gray3);
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      background: #fff;
      &:focus {
        border: 1px solid var(--primary);
      }
    }
  }
`;
