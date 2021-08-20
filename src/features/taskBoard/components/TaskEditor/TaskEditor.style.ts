import styled from "styled-components";
import { Button, TextArea } from "common/components/style";

export default styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  > .input-wrapper {
    max-height: min(10rem, 50vh);
    border-radius: 4px;
    flex-shrink: 1;
    overflow-y: hidden;
    margin-bottom: 0.5em;
    &:hover {
      overflow-y: auto;
    }
  }
  .task-options {
    flex-shrink: 0;
    ${Button} {
      margin-inline-end: 1em;
    }
  }
  .button-group {
    flex-shrink: 0;
    ${Button} {
      margin-block-start: 1em;
      margin-inline-end: 1em;
    }
  }
  .error {
    color: var(--danger);
    font-size: 0.75rem;
    margin-block-end: 0.75em;
  }
  ${TextArea} {
    &:first-child {
      font-weight: bold;
      textarea {
        font-weight: bold;
      }
    }
  }
`;
