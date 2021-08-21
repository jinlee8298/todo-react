import styled from "styled-components";

export default styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;

  input {
    top: 0;
    left: 0;
    width: 100%;
    cursor: inherit;
    height: 100%;
    margin: 0;
    opacity: 0;
    padding: 0;
    z-index: 1;
    position: absolute;
    &:checked ~ .decoration {
      border: 1px solid var(--primary);
      color: var(--primary);
      svg {
        opacity: 1;
        transform: scale(1);
      }
    }
    &:disabled ~ .decoration {
      border: 1px solid var(--gray1);
      background: var(--gray3);
      color: var(--gray1);
      svg {
        opacity: 1;
        transform: scale(1);
      }
      & ~ .label {
        color: var(--gray1);
      }
    }
    &:focus ~ .decoration {
      border: 1px solid var(--primary);
      box-shadow: inset 0 0 0 1px #fff, inset 0 0 0 2px var(--primary);
    }
  }
  .decoration {
    box-sizing: border-box;
    content: "";
    width: 1.25rem;
    height: 1.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: 1px solid var(--gray1);
    position: relative;
    padding: 0.3rem;
    color: var(--primary);
    transition: border 0.2s, box-shadow 0.2s;
    svg {
      opacity: 0;
      width: 100%;
      height: 100%;
      transform: scale(1.75);
      transition: opacity 0.2s, color 0.2s, transform 0.2s;
    }
  }
  .label {
    margin-inline-start: 0.5rem;
    transition: color 0.2s;
    font-weight: 600;
  }

  &:hover {
    cursor: pointer;
  }
`;
