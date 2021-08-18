import styled from "styled-components";

export default styled.span`
  --color: ${(props) => props.color ?? props.theme.primary};
  --color-20: ${(props) => `${props.color ?? props.theme.primary}33`};

  svg {
    font-size: 0.75rem;
    margin-inline-end: 0.25em;
  }

  background: var(--color-20);
  border-radius: 5px;
  border: 1px solid var(--color);
  color: var(--color);
  font-size: 0.75rem;
  padding: 0rem 0.25rem;
`;