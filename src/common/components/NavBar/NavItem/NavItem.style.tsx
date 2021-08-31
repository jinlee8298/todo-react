import styled from "styled-components";

export default styled.li`
  position: relative;
  padding: 0.5em 1.5em;
  outline: none;
  transition: color 0.2s, background 0.2s;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover,
  &:focus,
  &.active {
    color: var(--primary);
    background: var(--primary-10);
    cursor: pointer;
  }

  svg {
    margin-inline-end: 1em;
  }
`;
