import styled from "styled-components";
import Task from "../../Task/Task.style";

export default styled.div`
  background: var(--gray3);
  padding: 1em;
  flex-shrink: 1;
  overflow: hidden;
  position: relative;
  user-select: none;
  &:hover {
    overflow-y: auto;
  }

  ${Task}, .placeholder {
    width: var(--list-width);
    &:not(:first-child) {
      margin-block-start: 0.5rem;
    }
    &.dragging:first-child + ${Task}, &.dragging:first-child + .placeholder {
      margin-block-start: 0;
    }
  }

  .dropzone-padding {
    height: 1em;
    margin-block-end: -1em;
    &:not(:empty) {
      height: auto;
      margin-block-start: 0.5rem;
      padding-block-end: 1em;
      &:only-child {
        margin-block-start: 0;
      }
    }
  }
`;
