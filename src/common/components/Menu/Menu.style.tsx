import styled from "styled-components";
import { shadow } from "common/styles/common";

export default styled.ul`
  ${shadow};

  background: #fff;
  border-radius: 10px;
  list-style: none;
  margin: 0;
  max-height: 20rem;
  overflow: hidden;
  padding: 0.5rem 0;
  width: 184px;
  &:hover {
    overflow: auto;
  }
`;
