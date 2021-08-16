import styled from "styled-components";
import { shadow } from "common/styles/shadows";
import { Checkbox, Label, Button } from "common/components/style";

export default styled.div`
  ${shadow};
  background: #fff;
  border-radius: 8px;
  padding: 1em;
  position: relative;
  transition: box-shadow 0.2s;
  border: 1px solid var(--gray4);

  ${Checkbox} {
    margin-inline-end: 0.5em;
  }
  ${Label} {
    margin-block-start: 0.5em;
    margin-inline-end: 0.5em;
  }
  ${Button} {
    display: none;
    position: absolute;
    right: 0.25rem;
    top: 0.25rem;
    &.showing {
      display: inline-flex;
    }
  }
  .task-title {
    display: flex;
    align-items: flex-start;
  }
  .task-details {
    margin-block-start: 0.5em;
  }
  h3 {
    flex: 1;
    font-size: 1rem;
    line-height: 1.5em;
  }
  p {
    margin-block: 0.25em 0;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--gray1);
  }

  &:hover {
    cursor: pointer;
  }
  &:focus-within,
  &:hover {
    ${Button} {
      display: inline-flex;
    }
  }
`;
