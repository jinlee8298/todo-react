import styled from "styled-components";
import { shadow } from "common/styles/common";

export default styled.ul`
  ${shadow};

  background: var(--background);
  border-radius: 4px;
  list-style: none;
  margin: 0;
  max-height: 20rem;
  padding: 0;
  min-width: 11.5rem;
  overflow: hidden;
  font-size: 0.875rem;
  &:hover,
  &:focus-within {
    overflow: auto;
  }
`;
