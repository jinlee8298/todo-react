import "./App.css";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "styled-components";
import LightTheme from "common/styles/themes/LightTheme";
import TaskBoard from "features/taskBoard/components/TaskBoard/TaskBoard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header, NavBar } from "common/components";
import TaskBoardStyle from "features/taskBoard/components/TaskBoard/TaskBoard.style";
import ProjectNav from "features/taskBoard/components/ProjectNav/ProjectNav";

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
    --backdrop: #0000007f;
  }
  main {
    height: 100%;
    position: relative;
    ${TaskBoardStyle} {
      margin-inline-start: 17.5rem;
    }
  }
`;

function App() {
  return (
    <ThemeProvider theme={LightTheme}>
      <GlobalStyle />
      <Router>
        <div className="App">
          <Header />
          <main>
            <NavBar>
              <ProjectNav></ProjectNav>
            </NavBar>
            <Switch>
              <Route path={["/", "/:id"]} children={<TaskBoard />} />
            </Switch>
          </main>
          <div id="modal-container"></div>
          <div id="popover-container"></div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
