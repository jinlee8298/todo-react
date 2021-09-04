import { shadow } from "common/styles/common";
import styled from "styled-components";

export default styled.ul`
  ${shadow};
  background: var(--background);
  border-radius: 4px;
  padding: 0;
  list-style: none;
  margin: 0;
  width: 18.5rem;
  max-height: 21rem;
  overflow: hidden;
  position: relative;

  > label {
    position: sticky;
    top: 0;
    width: 18.5rem;
    margin: 0;
    padding: 0.5em;
  }

  &:hover,
  &:focus-within {
    overflow-y: auto;
  }
`;
