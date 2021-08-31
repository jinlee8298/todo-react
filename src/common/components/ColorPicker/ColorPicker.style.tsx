import { shadow, transitionTiming } from "common/styles/common";
import styled from "styled-components";

export const ColorButton = styled.button`
  ${transitionTiming}
  display: flex;
  background: var(--gray2);
  border: none;
  height: 2rem;
  width: 2rem;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;

  svg {
    color: #fff;
    font-size: 0.7rem;
    display: none;
  }

  &.selected {
    svg {
      display: block;
    }
  }

  &:hover,
  &:focus {
    outline: none;
    cursor: pointer;
    ${shadow};
    transform: scale(1.2);
  }
`;

export const ColorPickerContainer = styled.div`
  p {
    font-size: 0.875rem;
    font-weight: bold;
    margin-block-end: 0.5em;
  }
  > button {
    display: flex;
    align-items: center;
    border: none;
    background: none;
    padding: 0;
    color: var(--gray1);
    font-size: 0.75rem;
    overflow: visible;
    position: relative;
    .color-indicator {
      width: 2rem;
      height: 2rem;
      border-radius: 4px;
      border: none;
      background: var(--gray2);
      border: 1px solid var(--gray3);
      transition: box-shadow 0.2s, transform 0.2s;
    }
    > span {
      display: block;
      position: absolute;
      left: calc(100% + 0.5rem);
      word-break: keep-all;
      white-space: nowrap;
    }
    &:focus,
    &:hover {
      outline: none;
      cursor: pointer;
      .color-indicator {
        ${shadow};
        transform: scale(1.2);
      }
    }
  }
`;

export const ColorPickerPopover = styled.div`
  background: #fff;
  ${shadow};
  padding: 0.5em;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(4, 2em);
  grid-gap: 0.5em;
`;
