import styled from "styled-components";

export default styled.li`
  font-size: 0.875rem;
  padding: 0.7em 1rem;
  width: 18.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(.group-label) {
    &:hover,
    &:focus,
    &.selected {
      color: var(--primary);
      outline: none;
      cursor: pointer;
    }
    &:hover,
    &:focus {
      background: ${(props) => `${props.theme.primary}0D`};
    }
  }

  &.group-label {
    font-weight: bold;
    color: var(--gray1);
    padding: 0.5em 1rem;
    font-size: 0.7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    &:not(:first-child) {
      margin-top: 1rem;
    }
  }

  span {
    svg {
      margin-inline-end: 0.8em;
    }
  }
`;
