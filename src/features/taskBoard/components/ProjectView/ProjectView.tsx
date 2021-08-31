import StyledTaskBoard from "./ProjectView.style";
import { DragEventHandler, FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "common/hooks";
import {
  insertSectionPlaceholder,
  removeTaskPlaceholder,
  repositionSection,
} from "../../taskBoardSlice";
import { RootState } from "app/store";
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
  const draggingSectionInfo = useSelector(
    (state: RootState) => state.taskBoard.sections.draggingInfo
  );
  const match = useRouteMatch<{ id: string }>("/project/:id");
  const dispatch = useDispatch();

  useEffect(() => {
    if (match) {
      const { params } = match;
      setProjectId(params.id);
    }
  }, [match]);

  useEffect(() => {
    if (project?.name) {
      console.log("ProjectView");
      document.title = `Project: ${project?.name || ""}`;
    }
  }, [project?.name]);

  const onDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(removeTaskPlaceholder());
    }

    if (e.dataTransfer.types.includes("section")) {
      const targetEl = e.target as HTMLDivElement;
      if (targetEl.classList.contains("dropzone-padding")) {
        dispatch(insertSectionPlaceholder(projectId, null, -1));
      }
    }
  };

  const onSectionDrop: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.dataTransfer.types.includes("section")) {
      e.preventDefault();

      const sectionId = draggingSectionInfo?.draggingSectionId;
      const sectionIndex = project?.sectionIds.indexOf("placeholder");
      if (sectionId && sectionIndex) {
        dispatch(repositionSection(projectId, sectionId, sectionIndex));
      }
    }
  };

  const onDragSectionOver: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.dataTransfer.types.includes("section")) {
      e.preventDefault();
    }
  };

  return project ? (
    <StyledTaskBoard
      onDrop={onSectionDrop}
      onDragOver={onDragSectionOver}
      onDragEnter={onDragEnter}
    >
      <ProjectViewHeader project={project} />
      <ProjectViewBody project={project} />
      <TaskDetailsModal />
    </StyledTaskBoard>
  ) : null;
});

export default ProjectView;
