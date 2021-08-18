import { EntityId } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "common/hooks";
import {
  insertTaskPlaceholder,
  removeTaskPlaceholder,
  repositionTask,
} from "features/taskBoard/taskBoardSlice";
import { FC, DragEventHandler, DragEvent } from "react";
import StyledTaskSectionBody from "./TaskSectionBody.style";
import Placeholder from "../../Placeholder/Placeholder";
import Task from "../../Task/Task";

type TaskSectionBodyProps = {
  sectionId: EntityId;
  taskIds: EntityId[];
};

const TaskSectionBody: FC<TaskSectionBodyProps> = (props) => {
  const draggingInfo = useSelector(
    (state) => state.taskBoard.tasks.draggingInfo
  );
  const dispatch = useDispatch();

  const preventDrag: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  const onTaskDrop: DragEventHandler<HTMLElement> = (e) => {
    e.preventDefault();

    const taskId = draggingInfo?.draggingTaskId;
    const originSectionId = draggingInfo?.originSectionId;
    const taskIndex = props.taskIds.indexOf("placeholder");

    dispatch(
      repositionTask(props.sectionId, originSectionId, taskId, taskIndex)
    );

    if (originSectionId !== draggingInfo?.currentPlaceholderSecionId) {
      dispatch(removeTaskPlaceholder());
    }
  };

  const onDragEnterTaskList: DragEventHandler<HTMLElement> = (e) => {
    if (e.dataTransfer.types.includes("task")) {
      e.preventDefault();

      const nonDraggingTaskIds = props.taskIds.filter(
        (id) => id !== draggingInfo?.draggingTaskId
      );
      if (nonDraggingTaskIds?.length === 0) {
        dispatch(insertTaskPlaceholder(props.sectionId, null, 0));
        return;
      }

      const targetEl = e.target as HTMLDivElement;
      if (targetEl.classList.contains("dropzone-padding")) {
        dispatch(
          insertTaskPlaceholder(props.sectionId, null, props.taskIds.length)
        );
      }
    }
  };

  const onDragOverTaskList = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  return (
    <StyledTaskSectionBody
      className="task-list"
      draggable
      onDrop={onTaskDrop}
      onDragStart={preventDrag}
      onDragOver={onDragOverTaskList}
      onDragEnter={onDragEnterTaskList}
    >
      {props.taskIds.map((taskId) =>
        taskId === "placeholder" ? (
          <Placeholder
            key="placeholder"
            height={draggingInfo ? draggingInfo.placeholderHeight : "0px"}
          />
        ) : (
          <Task key={taskId} taskId={taskId} sectionId={props.sectionId} />
        )
      )}
      <div className="dropzone-padding"></div>
    </StyledTaskSectionBody>
  );
};

export default TaskSectionBody;
