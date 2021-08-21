import styled from "styled-components";

export default styled.li`
  --color: ${(props) => props.color};

  padding: 0.5em 1em;
  color: var(--text);
  display: flex;
  align-items: center;
  transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;

  span {
    white-space: nowrap;
  }
  svg {
    margin-inline-end: 0.75em;
  }

  &.danger {
    color: var(--color);
  }
  &:hover {
    cursor: pointer;
    color: var(--color);
    background: ${(props) => `${props.color}1A`};
  }
  &:focus {
    outline: none;
    border: 1px solid var(--color);
    color: var(--color);
    box-shadow: inset 0 0 0 1px #fff, inset 0 0 0 2px var(--color);
  }
`;
