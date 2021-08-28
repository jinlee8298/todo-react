import styled from "styled-components";

export default styled.header`
  background: var(--primary);
  display: flex;
  align-items: center;
  padding-inline: 1rem;
  .left-group {
    > * {
      margin-inline-end: 0.5rem;
    }
  }
  .toggle-nav {
    color: #fff;
    background: transparent;
    border: none;
    width: 1.5em;
    height: 1.5em;
    border-radius: 4px;
    font-size: 1rem;
    padding: 0;
    &:hover,
    &:focus {
      cursor: pointer;
      outline: none;
      background: #ffffff33;
    }
  }
`;
