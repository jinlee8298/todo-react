import "./App.css";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "styled-components";
import LightTheme from "../common/styles/themes/LightTheme";

const GlobalStyle = createGlobalStyle`
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
  }
  .App{
    padding: 20px;
  }
`;

function App() {
  return (
    <ThemeProvider theme={LightTheme}>
      <GlobalStyle />
      <div className="App"></div>
    </ThemeProvider>
  );
}

export default App;
