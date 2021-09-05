import styled from "styled-components";

export default styled.label`
  display: block;
  position: relative;
  margin-block-start: 0.375rem;
  .input-wrapper {
    display: block;
    position: relative;
    transition: all 0.2s;
    &.filled {
      .label {
        color: var(--text);
      }
    }
    &:focus-within {
      .label {
        color: var(--primary);
      }
    }
    &.filled,
    &:focus-within {
      .label {
        font-size: 0.75rem;
        top: -0.375rem;
        background: var(--background);
        left: calc(0.4rem - 2px);
        border-inline: 2px solid #fff;
      }
    }
    &.error {
      input {
        border: 1px solid var(--danger);
      }
      .label {
        color: var(--danger);
      }
    }
  }
  input {
    border-radius: 4px;
    border: 1px solid var(--gray3);
    font-size: 0.875rem;
    line-height: 1.5;
    outline: none;
    padding: 0.4rem 0.5rem;
    width: 100%;
    transition: all 0.2s;
    &:hover {
      border: 1px solid var(--gray2);
    }
    &:focus {
      border: 1px solid var(--primary);
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
  .error-message {
    margin-block-start: 0.3rem;
    color: var(--danger);
    font-size: 0.75rem;
    padding-inline: 0.4rem;
  }
`;
