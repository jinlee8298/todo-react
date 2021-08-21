import styled from "styled-components";
import TaskEditor from "../../TaskEditor/TaskEditor.style";

export default styled.div`
  > button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 1em 2rem;
    width: 100%;
    transition: color 0.2s, background 0.2s;
    outline: none;
    svg.fa-w-14 {
      font-size: 1rem;
      border-radius: 1.5rem;
      color: var(--primary);
      width: 1.5rem;
      height: 1.5rem;
      margin-inline-end: 1em;
      transition: color 0.2s, background 0.2s;
      padding: 0.25em;
    }
    &:hover,
    &:focus {
      cursor: pointer;
      color: var(--primary);
      svg {
        background: var(--primary);
        color: #fff;
      }
    }
  }
  > ${TaskEditor} {
    padding: 0 2rem;
    margin-block-start: 1rem;
  }
`;
