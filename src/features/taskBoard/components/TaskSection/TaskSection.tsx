import {
  DragEventHandler,
  useRef,
  FC,
  useState,
  DragEvent,
  Fragment,
  useEffect,
} from "react";
import StyledTaskSection from "./TaskSection.style";
import Task from "../Task/Task";
import { Button } from "common/components";
import { faEllipsisH, faPlus } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import {
  sectionSelector,
  taskSelector,
  addTask,
  repositionTask,
  insertTaskPlaceholder,
  removeTaskPlaceholder,
} from "../../taskBoardSlice";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "app/store";
import { useDispatch } from "common/hooks";
import TaskEditor from "../TaskEditor/TaskEditor";
import Placeholder from "../Placeholder/Placeholder";

type TaskSectionProps = {
  sectionId: EntityId;
};

const TaskSection: FC<TaskSectionProps> = (props) => {
  const [showTaskEdior, setTaskEditorVisibility] = useState(false);
  const section = useSelector((state: RootState) =>
    sectionSelector.selectById(state, props.sectionId)
  );
  const draggingInfo = useSelector(
    (state: RootState) => state.taskBoard.tasks.draggingInfo
  );
  const boardRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const preventDrag: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  const toggleTaskEditor = () => {
    setTaskEditorVisibility((visibility) => !visibility);
  };

  const onDragEnterTaskList: DragEventHandler<HTMLElement> = (e) => {
    e.preventDefault();

    const nonDraggingTaskIds = section?.taskIds.filter(
      (id) => id !== draggingInfo?.taskId
    );
    if (nonDraggingTaskIds?.length === 0) {
      dispatch(insertTaskPlaceholder(props.sectionId, 0));
      return;
    }

    const targetEl = e.target as HTMLDivElement;
    if (targetEl.classList.contains("dropzone-padding")) {
      dispatch(insertTaskPlaceholder(props.sectionId, section?.taskIds.length));
    }
  };

  const onDragOverTaskList = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const onDragEnterTask = (e: DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(insertTaskPlaceholder(props.sectionId, index));
  };

  const onDrop: DragEventHandler<HTMLElement> = (e) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");
    const originSectionId = e.dataTransfer.getData("originSectionId");
    const taskIndex = section?.taskIds.indexOf("placeholder");

    dispatch(
      repositionTask(props.sectionId, originSectionId, taskId, taskIndex)
    );

    if (originSectionId !== draggingInfo?.currentPlaceholderSecionId) {
      dispatch(removeTaskPlaceholder());
    }
  };
  return (
    <StyledTaskSection ref={boardRef} draggable>
      <header>
        <h3>{section?.name}</h3>
        <span>{section?.taskIds.length}</span>
        <Button icon={faEllipsisH} size="sx" rounded alternative="reverse" />
      </header>
      <div
        className="task-list"
        draggable
        onDrop={onDrop}
        onDragStart={preventDrag}
        onDragOver={onDragOverTaskList}
        onDragEnter={onDragEnterTaskList}
      >
        <div className="dropzone-padding"></div>
        {section?.taskIds.map((taskId, index) =>
          taskId === "placeholder" ? (
            <Placeholder
              key="placeholder"
              height={draggingInfo ? draggingInfo.placeholderHeight : "0px"}
            />
          ) : (
            <Task
              key={taskId}
              taskId={taskId}
              sectionId={props.sectionId}
              onDragEnter={(e) => onDragEnterTask(e, index)}
              positionIndex={index}
            />
          )
        )}
      </div>
      <footer draggable onDragStart={preventDrag}>
        {showTaskEdior ? (
          <TaskEditor
            mode="add"
            onCancel={toggleTaskEditor}
            sectionId={props.sectionId}
          />
        ) : (
          <Button
            icon={faPlus}
            title="Add task"
            alternative="outline"
            onClick={toggleTaskEditor}
          >
            Add task
          </Button>
        )}
      </footer>
    </StyledTaskSection>
  );
};

export default TaskSection;
