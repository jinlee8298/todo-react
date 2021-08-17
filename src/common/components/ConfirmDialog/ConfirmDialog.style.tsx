import styled from "styled-components";
import Modal from "../Modal/Modal";
import { Button } from "../style";

export default styled(Modal)`
  section {
    width: auto;
    min-width: 200px;
    border-radius: 8px;
    padding: 1.5rem;
    h2 {
      display: flex;
      align-items: center;
      margin-bottom: 1em;
      font-size: 1.25rem;
      span {
        display: flex;
        align-items: center;
      }
      svg {
        margin-inline-end: 0.5em;
      }
    }
    .message {
      margin-block-end: 1.5em;
    }
    .action-group {
      display: flex;
      justify-content: flex-end;
      ${Button} {
        margin-inline-start: 1em;
      }
    }
  }
`;
