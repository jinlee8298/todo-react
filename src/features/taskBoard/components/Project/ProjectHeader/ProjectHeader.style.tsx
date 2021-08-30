import { Button } from "common/components/style";
import styled from "styled-components";

export default styled.div`
  padding-inline: 2rem;
  margin-block: 1.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-size: 1.5rem;
    flex-shrink: 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-inline-end: 1rem;
    flex: 1;
  }
  ${Button} {
    flex-shrink: 0;
  }
`;
