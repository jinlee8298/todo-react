import "./App.css";
import { ThemeProvider } from "styled-components";
import LightTheme from "common/styles/themes/LightTheme";
import TaskBoard from "features/taskBoard/components/TaskBoard/TaskBoard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header, NavBar } from "common/components";
import ProjectNav from "features/taskBoard/components/ProjectNav/ProjectNav";
import LabelNav from "features/taskBoard/components/LabelNav/LabelNav";
import { useState } from "react";
import { GlobalStyle } from "common/styles/common";
import StyledApp from "./App.style";

function App() {
  const [showNavBar, setShowNavBar] = useState(false);
  const onToggleNavBar = () => {
    setShowNavBar((v) => !v);
  };
  return (
    <ThemeProvider theme={LightTheme}>
      <GlobalStyle />
      <Router>
        <StyledApp className="App">
          <Header onToggleNavBar={onToggleNavBar} />
          <main className={showNavBar ? "show-nav" : ""}>
            <NavBar>
              <ProjectNav></ProjectNav>
              <LabelNav></LabelNav>
            </NavBar>
            <Switch>
              <Route path={["/", "/:id"]} children={<TaskBoard />} />
            </Switch>
          </main>
          <div id="modal-container"></div>
          <div id="popover-container"></div>
        </StyledApp>
      </Router>
    </ThemeProvider>
  );
}

export default App;
