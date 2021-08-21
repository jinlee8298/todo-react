import styled from "styled-components";

type ButtonProps = {
  mainColor: string;
  textColor: string;
  size: string;
  rounded: boolean;
};

export default styled.button<ButtonProps>`
  --text-color: ${(props) => props.textColor};
  --button-color: ${(props) => props.mainColor};
  --button-color-80: ${(props) => `${props.mainColor}CC`};
  --button-color-20: ${(props) => `${props.mainColor}33`};
  --button-color-10: ${(props) => `${props.mainColor}1A`};

  display: inline-block;
  padding: 0.75em 1.5em;
  transition: background 0.2s, border 0.2s, box-shadow 0.2s;
  border-radius: ${({ rounded }) => (rounded ? `100rem` : `8px`)};
  border: 1px solid transparent;
  background: var(--button-color);
  color: var(--text-color);
  outline: none;
  font-size: ${(props) => props.size};
  box-sizing: border-box;
  font-weight: bold;

  svg {
    &:first-child {
      margin-inline-end: 0.5em;
    }
    &:last-child {
      margin-inline-start: 0.5em;
    }
    &:only-child {
      margin: 0;
      display: block;
    }
  }
  &.icon-button {
    padding: 0.75em;
    svg {
      font-size: 1.5em;
    }
  }
  &.outline,
  &.reverse {
    color: var(--button-color);
    &:hover {
      background: var(--button-color-20);
    }
    &:active {
      background: transparent;
    }
  }
  &.outline {
    border: 1px solid var(--button-color);
    background: transparent;
  }
  &.reverse {
    border: 1px solid transparent;
    background: var(--button-color-10);
    &:focus {
      border: 1px solid var(--button-color);
    }
  }

  &:hover {
    cursor: pointer;
    background: var(--button-color-80);
  }
  &:active {
    background: var(--button-color);
  }
  &:focus {
    box-shadow: inset 0 0 0 1px #fff, inset 0 0 0 2px var(--button-color);
  }
  &:disabled {
    background: var(--gray2);
    color: #fff;
    &:hover {
      cursor: default;
    }
    &.outline {
      background: var(--gray3);
      border-color: var(--gray2);
      color: var(--gray1);
    }
    &.reverse {
      background: var(--gray3);
      border-color: transparent;
      color: var(--gray1);
    }
  }
`;
