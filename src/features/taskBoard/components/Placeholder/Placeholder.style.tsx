import styled from "styled-components";

type PlaceholderContainerProps = {
  height: string;
};

export default styled.div<PlaceholderContainerProps>`
  height: ${(props) => props.height};
  border-radius: 8px;
  background: var(--gray3);
`;
