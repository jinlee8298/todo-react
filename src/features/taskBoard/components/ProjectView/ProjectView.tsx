import StyledTaskBoard from "./ProjectView.style";
import { FC, memo, useEffect, useState } from "react";
import { useSelector } from "common/hooks";
import { useRouteMatch } from "react-router-dom";
import TaskDetailsModal from "../TaskDetailsModal/TaskDetailsModal";
import ProjectViewHeader from "./ProjectViewHeader/ProjectViewHeader";
import { projectSelector } from "features/taskBoard/store/projectReducer";
import ProjectViewBody from "./ProjectViewBody";

type ProjectProps = {};

const ProjectView: FC<ProjectProps> = memo(() => {
  const [projectId, setProjectId] = useState("");
  const project = useSelector((state) =>
    projectSelector.selectById(state.taskBoard, projectId)
  );
  const match = useRouteMatch<{ id: string }>("/project/:id");

  useEffect(() => {
    if (match) {
      const { params } = match;
      setProjectId(params.id);
    }
  }, [match]);

  return project ? (
    <StyledTaskBoard>
      <ProjectViewHeader project={project} />
      <ProjectViewBody project={project} />
      <TaskDetailsModal />
    </StyledTaskBoard>
  ) : null;
});

export default ProjectView;
