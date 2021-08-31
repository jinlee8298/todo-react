import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EntityId } from "@reduxjs/toolkit";
import StyledNavGroup from "./ProjectNav.style";
import { NavBar } from "common/components";
import { useSelector } from "common/hooks";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import ProjectEditModal from "../ProjectEditModal/ProjectEditModal";
import ProjectMenu from "./ProjectMenu/ProjectMenu";
import { Project } from "features/taskBoard/types";
import { projectSelector } from "features/taskBoard/store/projectReducer";

const ProjectNav = () => {
  const projects = useSelector((state) =>
    projectSelector.selectAll(state.taskBoard)
  );
  const [isShownProjectModal, setIsShownProjectModal] = useState(false);
  const [selectledProject, setSelectedProject] = useState<Project | null>(null);
  const match = useRouteMatch<{ id: string }>("/project/:id");
  const history = useHistory();

  const onSelectProject = (projectId: EntityId) => {
    history.push(`/project/${projectId}`);
  };

  const onEditProject = (project: Project) => {
    setSelectedProject(project);
    toggleProjectModal();
  };

  const toggleProjectModal = () => {
    setIsShownProjectModal((v) => !v);
  };

  const onCloseEditModal = () => {
    setSelectedProject(null);
    toggleProjectModal();
  };

  return (
    <StyledNavGroup
      name="Projects"
      onAddButtonClick={toggleProjectModal}
      addButtonVisible
      expandByDefault
    >
      {projects.map((project) => (
        <NavBar.NavItem
          active={project.id === match?.params.id}
          className={"nav-item"}
          onTrigger={onSelectProject.bind(null, project.id)}
          key={project.id}
        >
          <FontAwesomeIcon icon={faTasks} color={project.color} fixedWidth />
          {project.name}
          <ProjectMenu
            onEdit={onEditProject.bind(null, project)}
            project={project}
          />
        </NavBar.NavItem>
      ))}
      <ProjectEditModal
        onCloseHandle={onCloseEditModal}
        isShown={isShownProjectModal}
        project={selectledProject}
      />
    </StyledNavGroup>
  );
};

export default ProjectNav;
