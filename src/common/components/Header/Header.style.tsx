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
`;
