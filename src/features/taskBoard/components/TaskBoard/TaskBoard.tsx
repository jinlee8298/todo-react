import StyledTaskBoard from "./TaskBoard.style";
import TaskSection from "../TaskSection/TaskSection";
import { DragEventHandler, FC, Fragment, useEffect, useState } from "react";
import { Button } from "common/components";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "common/hooks";
import AddSectionTrigger from "../AddSectionButton/AddSectionButton";
import {
  addSection,
  insertSectionPlaceholder,
  projectSelector,
  removeTaskPlaceholder,
  repositionSection,
} from "../../taskBoardSlice";
import Placeholder from "../Placeholder/Placeholder";
import { RootState } from "app/store";
import TaskSectionEditor from "../TaskSection/TaskSectionEditor/TaskSectionEditor";
import { useRouteMatch } from "react-router-dom";

type TaskBoardProps = {};

const TaskBoard: FC<TaskBoardProps> = (props) => {
  const [projectId, setProjectId] = useState("");
  const project = useSelector((state) =>
    projectSelector.selectById(state.taskBoard, projectId)
  );
  const draggingSectionInfo = useSelector(
    (state: RootState) => state.taskBoard.sections.draggingInfo
  );
  const [addingSection, setAddingSection] = useState(false);
  const match = useRouteMatch<{ id: string }>("/project/:id");
  const dispatch = useDispatch();

  useEffect(() => {
    if (match) {
      const { params } = match;
      setProjectId(params.id);
    }
  }, [match]);

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

      dispatch(repositionSection(projectId, sectionId, sectionIndex));
    }
  };

  const onDragSectionOver: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.dataTransfer.types.includes("section")) {
      e.preventDefault();
    }
  };

  const toggleAddingSection = () => {
    setAddingSection((v) => !v);
  };

  return (
    <StyledTaskBoard
      onDrop={onSectionDrop}
      onDragOver={onDragSectionOver}
      onDragEnter={onDragEnter}
    >
      {project && (
        <>
          <h1>{project.name}</h1>
          <div role="listbox">
            <div className="dropzone-padding"></div>
            {project?.sectionIds.map((id, index) => (
              <Fragment key={id}>
                {id === "placeholder" ? (
                  <Placeholder
                    height={draggingSectionInfo?.placeholderHeight ?? "100%"}
                  />
                ) : (
                  <TaskSection key={id} sectionId={id} projectId={projectId} />
                )}

                {index !== project?.sectionIds.length - 1 && (
                  <AddSectionTrigger
                    onClick={(e) => {
                      dispatch(
                        addSection(projectId, { name: "test2" }, index + 1)
                      );
                    }}
                  />
                )}
              </Fragment>
            ))}
            {addingSection ? (
              <TaskSectionEditor
                projectId={projectId}
                onCloseHandle={toggleAddingSection}
              />
            ) : (
              <Button
                onClick={toggleAddingSection}
                alternative="reverse"
                icon={faPlusSquare}
              >
                Add new section
              </Button>
            )}
          </div>
        </>
      )}
    </StyledTaskBoard>
  );
};

export default TaskBoard;
