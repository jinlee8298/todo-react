import styled from "styled-components";
import { mediumShadow } from "common/styles/common";
import { Checkbox, Label, Button } from "common/components/style";

export default styled.div`
  ${mediumShadow};

  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  padding: 1em;
  position: relative;
  transition: box-shadow 0.2s;
  border: 1px solid var(--gray4);

  &.dragging {
    display: none;
  }
  &.medium,
  &.high,
  &.urgent {
    &::before {
      display: block;
      position: absolute;
      height: 100%;
      width: 0.5rem;
      content: "";
      top: 0;
      left: 0;
    }
  }
  &.medium::before {
    background: var(--success);
  }
  &.high::before {
    background: var(--warning);
  }
  &.urgent::before {
    background: var(--danger);
  }
  &.finished {
    h3 {
      text-decoration: line-through;
      color: var(--gray1);
    }
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

  ${Checkbox} {
    margin-inline-end: 0.5em;
  }
  ${Label} {
    margin-block-start: 0.5em;
    margin-inline-end: 0.5em;
  }
  > ${Button} {
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
  .task-details:not(:empty) {
    margin-block-start: 0.5em;
    display: flex;
  }
  h3 {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.5em;
    word-break: break-all;
  }
  p {
    margin-block: 0.25em 0;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--gray1);
  }
`;
