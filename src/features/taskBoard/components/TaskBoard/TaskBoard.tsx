import StyledTaskBoard from "./TaskBoard.style";
import TaskSection from "../TaskSection/TaskSection";
import { DragEventHandler, FC, Fragment } from "react";
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

type TaskBoardProps = {};
let cachedOrder = 0;

const TaskBoard: FC<TaskBoardProps> = (props) => {
  const project = useSelector((state) =>
    projectSelector.selectById(state.taskBoard, "2021")
  );
  const draggingSectionInfo = useSelector(
    (state: RootState) => state.taskBoard.sections.draggingInfo
  );
  const dispatch = useDispatch();

  const onDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(removeTaskPlaceholder());
    }

    if (e.dataTransfer.types.includes("section")) {
      const targetEl = e.target as HTMLDivElement;
      if (targetEl.classList.contains("dropzone-padding")) {
        dispatch(insertSectionPlaceholder("2021", null, -1));
      }
    }
  };

  const onSectionDrop: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.dataTransfer.types.includes("section")) {
      e.preventDefault();

      const sectionId = draggingSectionInfo?.draggingSectionId;
      const sectionIndex = project?.sectionIds.indexOf("placeholder");

      dispatch(repositionSection("2021", sectionId, sectionIndex));
    }
  };

  const onDragSectionOver: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.dataTransfer.types.includes("section")) {
      e.preventDefault();
    }
  };

  return (
    <StyledTaskBoard
      onDrop={onSectionDrop}
      onDragOver={onDragSectionOver}
      onDragEnter={onDragEnter}
    >
      <div className="dropzone-padding"></div>
      {project?.sectionIds.map((id, index) => (
        <Fragment key={id}>
          {id === "placeholder" ? (
            <Placeholder
              height={draggingSectionInfo?.placeholderHeight ?? "100%"}
            />
          ) : (
            <TaskSection key={id} sectionId={id} projectId="2021" />
          )}

          {index !== project?.sectionIds.length - 1 && (
            <AddSectionTrigger
              onClick={(e) => {
                dispatch(addSection("2021", { name: "test2" }, index + 1));
              }}
            />
          )}
        </Fragment>
      ))}

      <Button
        alternative="reverse"
        icon={faPlusSquare}
        onClick={(e) =>
          dispatch(
            addSection("2021", {
              name: "test" + cachedOrder++,
            })
          )
        }
      >
        Add new section
      </Button>
    </StyledTaskBoard>
  );
};

export default TaskBoard;
