import styled from "styled-components";

export default styled.label`
  display: block;
  margin-block-start: 0.375rem;
  .input-wrapper {
    display: block;
    border-radius: 4px;
    border: 1px solid var(--gray3);
    padding: 0.4rem 0.5rem;
    position: relative;
    transition: all 0.2s;
    &.filled {
      .label {
        color: var(--text);
      }
    }
    &:hover {
      border: 1px solid var(--gray2);
    }
    &:focus-within {
      border: 1px solid var(--primary);
      .label {
        color: var(--primary);
      }
    }
    &.filled,
    &:focus-within {
      .label {
        font-size: 0.75rem;
        top: -0.375rem;
        background: #fff;
        left: calc(0.4rem - 2px);
        border-inline: 2px solid #fff;
      }
    }
    &.error {
      border: 1px solid var(--danger);
      .label {
        color: var(--danger);
      }
    }
  }
  .label {
    position: absolute;
    top: calc(0.328125rem + 0.4rem);
    left: 0.4rem;
    font-size: 0.875rem;
    color: var(--gray1);
    line-height: 0.75;
    border-inline: 2px solid transparent;
    transition: all 0.2s;
  }
  textarea {
    border: none;
    display: block;
    font-size: 0.875rem;
    line-height: 1.5;
    outline: none;
    overflow: hidden;
    padding: 0;
    resize: none;
    width: 100%;
  }
  .error-message {
    margin-block-start: 0.3rem;
    color: var(--danger);
    font-size: 0.75rem;
    padding-inline: 0.4rem;
  }
`;
