import styled from "styled-components";
import Placeholder from "../../Placeholder/Placeholder.style";
import Task from "../../Task/Task.style";

export default styled.div`
  background: var(--gray3);
  padding: 1em;
  flex-shrink: 1;
  overflow: hidden;
  position: relative;
  &:hover {
    overflow-y: auto;
  }

  ${Task}, ${Placeholder} {
    width: var(--list-width);
    &:not(:first-child) {
      margin-block-start: 0.5rem;
    }
    &.dragging:first-child + ${Task}, &.dragging:first-child + ${Placeholder} {
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
