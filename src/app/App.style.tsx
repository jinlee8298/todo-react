import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  header {
    flex-basis: 44px;
    flex-shrink: 0;
  }
  main {
    position: relative;
    flex: 1;
    flex-basis: 0px;
    overflow: hidden;
  }
`;
