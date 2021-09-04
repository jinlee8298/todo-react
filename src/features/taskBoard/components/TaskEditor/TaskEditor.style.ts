import styled from "styled-components";
import { Button, Label } from "common/components/style";

export default styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  .label-wrapper {
    ${Label}:not(:last-child) {
      margin-inline-end: 0.5em;
    }
  }
  > .input-wrapper {
    max-height: min(10rem, 50vh);
    border-radius: 4px;
    flex-shrink: 1;
    overflow-y: auto;
    border: 1px solid var(--gray3);
    margin-bottom: 0.5em;
    padding: 0.5rem;
    background: var(--background);

    &:hover {
      border: 1px solid var(--gray2);
    }
    &:focus-within {
      border: 1px solid var(--primary);
    }

    textarea {
      border: none;
      padding: 0;
      outline: none;
      resize: none;
      display: block;
      font-size: 0.8rem;
      line-height: 1.5;
      overflow: hidden;
      width: 100%;
      &:first-child {
        margin-bottom: 0.5em;
        font-weight: bold;
      }
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
`;
