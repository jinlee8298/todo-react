import styled from "styled-components";

export default styled.div`
  display: flex;
  padding: 1rem;
  .icon {
    flex: 0;
    padding-inline-end: 0.5rem;
    flex-basis: 2rem;
    svg {
      font-size: 2rem;
    }
  }
  .details {
    flex: 1;
    .user {
      font-weight: bold;
      margin-inline-end: 0.5em;
    }
    .time {
      color: var(--gray1);
      font-size: 0.7rem;
    }
    .content {
      font-size: 0.875rem;
    }
  }
`;
