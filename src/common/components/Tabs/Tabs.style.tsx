import styled from "styled-components";

export default styled.div`
  .tab-container > section[aria-hidden="true"] {
    display: none;
  }
  .tab-list {
    display: flex;
    > span {
      border-block-end: 1px solid var(--gray3);
      font-size: 0.875rem;
      padding: 1em;
      text-align: center;
      flex: 1;
      &.active {
        color: var(--primary);
        border-block-end: 1px solid var(--primary);
        font-weight: bold;
      }
      &:hover {
        color: var(--primary);
        cursor: pointer;
      }
    }
  }
`;
