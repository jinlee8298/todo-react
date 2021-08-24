import { Button } from "common/components/style";
import styled from "styled-components";

export default styled.div`
  width: 100%;
  transition: padding 0.2s;
  ${Button} {
    margin-block-start: 1em;
    margin-inline-end: 1em;
  }
`;
