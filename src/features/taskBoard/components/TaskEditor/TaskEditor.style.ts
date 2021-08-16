import styled from "styled-components";
import { Button } from "common/components/style";

export default styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--gray3);
  .input-wrapper {
    max-height: min(10rem, 50vh);
    flex-shrink: 1;
    overflow-y: auto;
    margin-bottom: 0.5em;
  }
  .task-options {
    flex-shrink: 0;
    ${Button} {
      margin-inline-end: 1em;
    }
  }
  textarea {
    border: none;
    display: block;
    outline: none;
    overflow: hidden;
    padding: 0;
    resize: none;
    width: 100%;
    &.title {
      font-weight: bold;
      margin-bottom: 0.4em;
    }
    &.description {
      margin-bottom: 0.6em;
    }
    &::placeholder {
      color: var(--gray2);
    }
  }
  .button-group {
    flex-shrink: 0;
    ${Button} {
      margin-block-start: 1em;
      margin-inline-end: 1em;
    }
  }
`;
