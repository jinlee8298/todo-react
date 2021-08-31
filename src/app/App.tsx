import "./App.css";
import { ThemeProvider } from "styled-components";
import LightTheme from "common/styles/themes/LightTheme";
import ProjectView from "features/taskBoard/components/ProjectView/ProjectView";
import { Route, Switch } from "react-router-dom";
import { Header } from "common/components";
import { GlobalStyle } from "common/styles/common";
import StyledApp from "./App.style";
import ProjectNav from "features/taskBoard/components/ProjectNav/ProjectNav";
import LabelNav from "features/taskBoard/components/LabelNav/LabelNav";
import LabelView from "features/taskBoard/components/LabelView/LabelView";
import ProjectBoard from "features/taskBoard/components/ProjectBoard/ProjectBoard";

function App() {
  const navContent = (
    <>
      <ProjectNav /> <LabelNav />
    </>
  );
  return (
    <ThemeProvider theme={LightTheme}>
      <GlobalStyle />
      <StyledApp className="App">
        <Header navContent={navContent} />
        <main>
          <Switch>
            <Route path={["/label/:id"]} children={<LabelView />} />
            <Route path={["/project/:id"]} children={<ProjectView />} />
            <Route path={["/"]} children={<ProjectBoard />} />
          </Switch>
        </main>
        <div id="modal-container"></div>
        <div id="popover-container"></div>
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
