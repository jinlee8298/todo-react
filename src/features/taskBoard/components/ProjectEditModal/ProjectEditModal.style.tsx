import { Modal } from "common/components";
import { Button, TextInput } from "common/components/style";
import styled from "styled-components";

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
