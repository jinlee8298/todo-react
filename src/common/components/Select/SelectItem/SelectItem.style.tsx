import styled from "styled-components";

export default styled.li`
  font-size: 0.875rem;
  padding: 0.7em 1rem;
  width: 18.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover,
  &:focus,
  &.selected {
    color: var(--primary);
    background: ${(props) => `${props.theme.primary}0D`};
    outline: none;
    cursor: pointer;
  }
  span {
    svg {
      margin-inline-end: 0.8em;
    }
  }
`;
