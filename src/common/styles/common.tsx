import { createGlobalStyle, css } from "styled-components";

export const transitionTiming = css`
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.175);
`;

export const smoothShadow = css`
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05), 0px 25px 35px rgba(0, 0, 0, 0.03);
`;

export const mediumShadow = css`
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05), 0px 25px 35px rgba(0, 0, 0, 0.03);
`;

export const shadow = css`
  box-shadow: rgb(67 90 111 / 30%) 0px 0px 1px,
    rgb(67 90 111 / 47%) 0px 8px 10px -4px;
`;

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary: ${(props) => props.theme.primary};
    --success: ${(props) => props.theme.success};
    --danger: ${(props) => props.theme.danger};
    --warning: ${(props) => props.theme.warning};
    --info: ${(props) => props.theme.info};
    --gray1: ${(props) => props.theme.gray1};
    --gray2: ${(props) => props.theme.gray2};
    --gray3: ${(props) => props.theme.gray3};
    --gray4: ${(props) => props.theme.gray4};
    --text: ${(props) => props.theme.text};
    --backdrop: #0000007f;
  }
`;
