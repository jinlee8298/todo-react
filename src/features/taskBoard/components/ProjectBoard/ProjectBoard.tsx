import { useSelector } from "common/hooks";
import { projectSelector } from "features/taskBoard/store/projectReducer";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProjectEditModal from "../ProjectEditModal/ProjectEditModal";
import StyledBoard from "./ProjectBoard.style";

const ProjectBoard = () => {
  const projects = useSelector((state) =>
    projectSelector.selectAll(state.taskBoard)
  );
  const [isShownProjectModal, setIsShownProjectModal] = useState(false);

  const toggleProjectModal = () => {
    setIsShownProjectModal((v) => !v);
  };
  return (
    <StyledBoard>
      <h1>Your project(s)</h1>
      <div className="project-container">
        {projects.map((project) => (
          <Link
            key={project.id}
            title={project.name}
            to={`/project/${project.id}`}
            className="project-card"
            style={{ ["--card-color" as any]: project.color }}
          >
            <span>{project.name}</span>
          </Link>
        ))}
        <button onClick={toggleProjectModal} className="project-card">
          Create new project
        </button>
      </div>
      <ProjectEditModal
        onCloseHandle={toggleProjectModal}
        isShown={isShownProjectModal}
        project={null}
      />
    </StyledBoard>
  );
};

export default ProjectBoard;
