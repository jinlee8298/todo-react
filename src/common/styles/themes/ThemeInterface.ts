import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    primary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    text: string;
    background: string;
  }
}
