import { EntityId } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "common/hooks";
import {
  insertTaskPlaceholder,
  removeTaskPlaceholder,
  repositionTask,
} from "features/taskBoard/taskBoardSlice";
import { FC, DragEventHandler, DragEvent, useState, useCallback } from "react";
import StyledTaskSectionBody from "./TaskSectionBody.style";
import Placeholder from "../../Placeholder/Placeholder";
import Task from "../../Task/Task";
import TaskDetailsModal from "../../TaskDetailsModal/TaskDetailsModal";

type TaskSectionBodyProps = {
  sectionId: EntityId;
  taskIds: EntityId[];
};

const TaskSectionBody: FC<TaskSectionBodyProps> = ({ sectionId, taskIds }) => {
  const draggingInfo = useSelector(
    (state) => state.taskBoard.tasks.draggingInfo
  );
  const [showTaskDetails, setShowTaskDetails] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<EntityId>(0);
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
    const taskIndex = taskIds.indexOf("placeholder");

    dispatch(repositionTask(sectionId, originSectionId, taskId, taskIndex));

    if (originSectionId !== draggingInfo?.currentPlaceholderSecionId) {
      dispatch(removeTaskPlaceholder());
    }
  };

  const onDragEnterTaskList: DragEventHandler<HTMLElement> = (e) => {
    if (e.dataTransfer.types.includes("task")) {
      e.preventDefault();

      const nonDraggingTaskIds = taskIds.filter(
        (id) => id !== draggingInfo?.draggingTaskId
      );
      if (nonDraggingTaskIds?.length === 0) {
        dispatch(insertTaskPlaceholder(sectionId, null, 0));
        return;
      }

      const targetEl = e.target as HTMLDivElement;
      if (targetEl.classList.contains("dropzone-padding")) {
        dispatch(insertTaskPlaceholder(sectionId, null, taskIds.length));
      }
    }
  };

  const onDragOverTaskList = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const openTaskDetailsModal = useCallback((taskId: EntityId) => {
    setCurrentTaskId(taskId);
    setShowTaskDetails((v) => !v);
  }, []);

  const toggleTaskDetailsModal = useCallback(() => {
    setShowTaskDetails((v) => !v);
  }, []);

  return (
    <StyledTaskSectionBody
      className="task-list"
      draggable
      onDrop={onTaskDrop}
      onDragStart={preventDrag}
      onDragOver={onDragOverTaskList}
      onDragEnter={onDragEnterTaskList}
    >
      {taskIds.map((taskId) =>
        taskId === "placeholder" ? (
          <Placeholder
            key="placeholder"
            height={draggingInfo ? draggingInfo.placeholderHeight : "0px"}
          />
        ) : (
          <Task
            key={taskId}
            onClick={openTaskDetailsModal}
            taskId={taskId}
            sectionId={sectionId}
          />
        )
      )}
      <div className="dropzone-padding"></div>
      <TaskDetailsModal
        isShown={showTaskDetails}
        taskId={currentTaskId}
        handleClose={toggleTaskDetailsModal}
      />
    </StyledTaskSectionBody>
  );
};

export default TaskSectionBody;
