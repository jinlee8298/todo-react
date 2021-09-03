import { useSelector } from "common/hooks";
import { labelSelector } from "features/taskBoard/store/labelReducer";
import { projectSelector } from "features/taskBoard/store/projectReducer";
import { taskSelector } from "features/taskBoard/store/taskReducer";
import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router";

const TitleHandler = () => {
  const homeMatch = useRouteMatch({ path: "/", exact: true });
  const projectViewMatch = useRouteMatch<{ taskId: string; projectId: string }>(
    ["/project/:projectId/task/:taskId", "/project/:projectId"]
  );
  const projectId = projectViewMatch?.params.projectId;
  const project = useSelector((state) => {
    if (projectId) {
      return projectSelector.selectById(state.taskBoard, projectId);
    }
  });
  const labelViewMatch = useRouteMatch<{ taskId: string; labelId: string }>([
    "/label/:labelId/task/:taskId",
    "/label/:labelId",
  ]);
  const labelId = labelViewMatch?.params.labelId;
  const label = useSelector((state) => {
    if (labelId) {
      return labelSelector.selectById(state.taskBoard, labelId);
    }
  });
  const taskId =
    projectViewMatch?.params.taskId || labelViewMatch?.params.taskId;
  const task = useSelector((state) => {
    if (taskId) {
      return taskSelector.selectById(state.taskBoard, taskId);
    }
  });
  const history = useHistory();

  useEffect(() => {
    if (projectViewMatch) {
      if (task) {
        document.title = `Task: ${task.title}`;
        return;
      } else if (project) {
        document.title = `Project: ${project.name}`;
        return;
      }
    }
    if (labelViewMatch) {
      if (task) {
        document.title = `Task: ${task.title}`;
        return;
      } else if (label) {
        document.title = `Label: ${label.name}`;
        return;
      }
    }

    if (homeMatch) {
      document.title = "Project(s) board";
    } else {
      history.push("/");
    }
    // Redirect to homepage if task and/or project/label can't be found
  }, [
    history,
    homeMatch,
    projectViewMatch,
    labelViewMatch,
    task,
    project,
    label,
  ]);

  return null;
};

export default TitleHandler;
