import styled from "styled-components";

export default styled.button`
  width: 1px;
  padding: 0;
  border: none;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  background: transparent;
  outline: none;
  height: 100%;

  svg {
    background: var(--background);
    color: var(--primary);
    font-size: 1.4rem;
    padding: 0.2em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &::before {
    content: " ";
    position: absolute;
    background: var(--primary);
    width: 1px;
    height: 100%;
    top: 0;
    left: 50%;
    display: block;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  &::after {
    content: " ";
    position: absolute;
    width: 0.5rem;
    height: 100%;
    top: 0;
    left: 50%;
    display: block;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover,
  &:focus {
    cursor: pointer;
    &::after,
    &::before,
    svg {
      opacity: 1;
    }
  }
`;
