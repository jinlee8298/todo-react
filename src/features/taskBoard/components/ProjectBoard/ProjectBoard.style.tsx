import { shadow } from "common/styles/common";
import styled from "styled-components";

export default styled.div`
  padding: 2rem 1rem;
  max-width: 50rem;
  margin-inline: auto;
  h1 {
    margin-block-end: 1rem;
  }
  .project-container {
    display: flex;
    flex-wrap: wrap;
  }
  .project-card {
    margin: 0.5rem;
    flex: 1;
    flex-basis: 11rem;
    transition: box-shadow 0.2s, transform 0.2s;
    height: 6.5rem;
    text-decoration: none;
    background: var(--card-color);
    border-radius: 8px;
    padding: 0.5em;
    color: #fff;
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover,
    &:focus {
      ${shadow}
      transform: scale(1.025);
    }
  }
  button.project-card {
    border: 1px solid var(--primary);
    color: var(--primary);
    &:hover,
    &:focus {
      cursor: pointer;
    }
  }
`;
