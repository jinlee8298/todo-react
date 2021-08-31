import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "common/components";
import { useDispatch } from "common/hooks";
import { updateProject } from "features/taskBoard/taskBoardSlice";
import { Project } from "features/taskBoard/types";
import { FC, useState } from "react";
import ProjectEditModal from "../../ProjectEditModal/ProjectEditModal";
import ProjectMenu from "../../ProjectNav/ProjectMenu/ProjectMenu";
import StyledHeader from "./ProjectViewHeader.style";

type ProjectViewHeaderProps = {
  project: Project;
};

const ProjectViewHeader: FC<ProjectViewHeaderProps> = ({ project }) => {
  const dispatch = useDispatch();
  const [isShownProjectModal, setIsShownProjectModal] = useState(false);
  const [selectledProject, setSelectedProject] = useState<Project | null>(null);
  const onEditProject = () => {
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

  const toggleCompletedTaskVisibility = () => {
    dispatch(
      updateProject({
        id: project.id,
        changes: {
          filterOptions: {
            showCompletedTask: !project.filterOptions.showCompletedTask,
          },
        },
      })
    );
  };

  const additionMenu = (action: { close: () => void; open: () => void }) => {
    return (
      <Menu.Item
        icon={project.filterOptions.showCompletedTask ? faEyeSlash : faEye}
        onTrigger={() => {
          toggleCompletedTaskVisibility();
          action.close();
        }}
      >
        {project.filterOptions.showCompletedTask ? "Hide" : "Show"} completed
        task(s)
      </Menu.Item>
    );
  };
  return (
    <StyledHeader>
      <h1>{project.name}</h1>
      <ProjectMenu
        additionOptions={additionMenu}
        project={project}
        onEdit={onEditProject}
      />
      <ProjectEditModal
        onCloseHandle={onCloseEditModal}
        isShown={isShownProjectModal}
        project={selectledProject}
      />
    </StyledHeader>
  );
};

export default ProjectViewHeader;
