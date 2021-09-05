import Button from "common/components/Button/Button.style";
import styled from "styled-components";

export default styled.div`
  width: 18.5rem;
  > p {
    font-size: 0.875rem;
    padding: 0.7em 1rem;
    &:not(:last-child) {
      margin-block-end: 0.5em;
    }
  }
  .add-label {
    font-weight: bold;
    &:hover {
      cursor: pointer;
      background: ${(props) => `${props.theme.primary}0D`};
    }
  }
  ${Button} {
    border-radius: 4px;
    margin-inline-end: 1rem;
  }
`;
