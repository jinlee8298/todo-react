import styled from "styled-components";
import { Modal } from "common/components";
import TextInput from "common/components/TextInput/TextInput.style";
import Button from "common/components/Button/Button.style";

export default styled(Modal)`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 1em;
  }
  ${TextInput} {
    margin-block-end: 1em;
  }
  section {
    max-width: 25rem;
    border-radius: 8px;
    padding: 1rem;
  }
  .action {
    text-align: right;
    margin-block-start: 1em;
    ${Button} {
      margin-inline-start: 1em;
    }
  }
`;
