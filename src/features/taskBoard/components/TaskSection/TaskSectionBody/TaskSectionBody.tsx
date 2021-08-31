import { EntityId } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "common/hooks";
import {
  insertTaskPlaceholder,
  removeTaskPlaceholder,
  repositionTask,
} from "features/taskBoard/taskBoardSlice";
import { FC, DragEventHandler, DragEvent, useCallback } from "react";
import StyledTaskSectionBody from "./TaskSectionBody.style";
import Placeholder from "../../Placeholder/Placeholder";
import Task from "../../Task/Task";
import { useHistory, useRouteMatch } from "react-router-dom";
import { projectSelector } from "features/taskBoard/store/projectReducer";

type TaskSectionBodyProps = {
  sectionId: EntityId;
  taskIds: EntityId[];
  finishedTaskIds: EntityId[];
};

const TaskSectionBody: FC<TaskSectionBodyProps> = ({
  sectionId,
  taskIds,
  finishedTaskIds,
}) => {
  const draggingInfo = useSelector(
    (state) => state.taskBoard.tasks.draggingInfo
  );
  const match = useRouteMatch<{ projectId: string }>("/project/:projectId");
  const history = useHistory();
  const projectId = match?.params.projectId;
  const filterOptions = useSelector(
    (state) =>
      projectSelector.selectById(state.taskBoard, projectId || "")
        ?.filterOptions
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
    const taskIndex = taskIds.indexOf("placeholder");
    if (originSectionId && taskId) {
      dispatch(repositionTask(sectionId, originSectionId, taskId, taskIndex));
    }

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

  const openTaskDetailsModal = useCallback(
    (taskId: EntityId) => {
      sessionStorage.setItem("currentSectionId", sectionId.toString());
      history.push(`/project/${projectId}/task/${taskId}`);
    },
    [history, projectId, sectionId]
  );

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

      <div className="dropzone-padding">
        {filterOptions?.showCompletedTask &&
          finishedTaskIds.map((taskId) => (
            <Task
              key={taskId}
              onClick={openTaskDetailsModal}
              taskId={taskId}
              sectionId={sectionId}
            />
          ))}
      </div>
    </StyledTaskSectionBody>
  );
};

export default TaskSectionBody;
