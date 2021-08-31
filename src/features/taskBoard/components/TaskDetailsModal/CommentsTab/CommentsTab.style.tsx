import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .comment-container {
    overflow: auto;
    flex: 1;
  }
  .comment-actions {
    margin-block-start: 0.5em;
    flex-shrink: 0;
    .button-group {
      margin-block-start: 0.5em;
      text-align: right;
    }
    .error-message {
      font-size: 0.875rem;
      color: var(--danger);
    }
  }
`;
