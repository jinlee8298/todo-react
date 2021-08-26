import styled from "styled-components";
import { transtionTiming } from "common/styles/common";

export default styled.div`
  --primary-10: ${(props) => `${props.theme.primary}1A`};

  margin-block-end: 1rem;

  &.expand {
    .group-name {
      span > svg {
        transform: rotate(90deg);
      }
    }
  }

  .group-name {
    width: 100%;
    border: none;
    background: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em 1.5em;
    font-size: 0.875rem;
    font-weight: bold;
    span > svg {
      margin-inline-end: 1em;
      transition: transform 0.2s;
      ${transtionTiming}
    }
    &:hover {
      cursor: pointer;
    }
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 0;
    transition: height 0.2s;
    ${transtionTiming}
    overflow: hidden;
  }
`;
