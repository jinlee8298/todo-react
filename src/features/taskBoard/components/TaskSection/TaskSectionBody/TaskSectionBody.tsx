import { EntityId } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "common/hooks";
import { repositionTask } from "features/taskBoard/taskBoardSlice";
import { FC, useCallback, MouseEventHandler } from "react";
import StyledTaskSectionBody from "./TaskSectionBody.style";
import Task from "../../Task/Task";
import { useHistory, useRouteMatch } from "react-router-dom";
import { projectSelector } from "features/taskBoard/store/projectReducer";

type TaskSectionBodyProps = {
  sectionId: EntityId;
  taskIds: EntityId[];
  finishedTaskIds: EntityId[];
};

let draggingTask = false;

const taskPlaceholderNode: HTMLElement = document.createElement("div");
taskPlaceholderNode.classList.add("placeholder");

const TaskSectionBody: FC<TaskSectionBodyProps> = ({
  sectionId,
  taskIds,
  finishedTaskIds,
}) => {
  const match = useRouteMatch<{ projectId: string }>("/project/:projectId");
  const history = useHistory();
  const projectId = match?.params.projectId;
  const filterOptions = useSelector(
    (state) =>
      projectSelector.selectById(state.taskBoard, projectId || "")
        ?.filterOptions
  );
  const dispatch = useDispatch();

  const openTaskDetailsModal = useCallback(
    (taskId: EntityId) => {
      history.push(`/project/${projectId}/task/${taskId}`);
    },
    [history, projectId]
  );

  const onMouseEnterTask = (
    e: React.MouseEvent<Element, MouseEvent>,
    taskId: EntityId
  ) => {
    if (draggingTask) {
      const taskIndex = taskIds.indexOf(taskId);
      taskPlaceholderNode.dataset.sectionId = sectionId.toString();
      taskPlaceholderNode.dataset.index = taskIndex.toString();
      const parentEle = e.currentTarget.parentElement;
      parentEle?.insertBefore(taskPlaceholderNode, e.currentTarget);
    }
  };

  const onMouseEnterDropZonePadding: MouseEventHandler = (e) => {
    if (draggingTask) {
      const taskIndex = taskIds.length;
      taskPlaceholderNode.dataset.sectionId = sectionId.toString();
      taskPlaceholderNode.dataset.index = taskIndex.toString();
      const parentEle = e.currentTarget.parentElement;
      parentEle?.insertBefore(taskPlaceholderNode, e.currentTarget);
    }
  };

  const onTaskStartDrag = (dragEle: HTMLElement, taskId: EntityId) => {
    draggingTask = true;
    const taskIndex = taskIds.indexOf(taskId);
    taskPlaceholderNode.dataset.taskId = taskId.toString();
    taskPlaceholderNode.dataset.originSectionId = sectionId.toString();
    taskPlaceholderNode.dataset.index = taskIndex.toString();
    taskPlaceholderNode.style.height = `${dragEle.offsetHeight}px`;
    const parentEle = dragEle.parentElement;
    parentEle?.insertBefore(taskPlaceholderNode, dragEle.nextSibling);
  };

  const onTaskEndDrag = () => {
    draggingTask = false;
    const dataset = taskPlaceholderNode.dataset;
    const destionationSectionId = dataset.sectionId;
    const originSectionId = dataset.originSectionId;
    const taskId = dataset.taskId;
    const index = dataset.index;
    if (destionationSectionId && originSectionId && taskId && index) {
      dispatch(
        repositionTask(
          destionationSectionId,
          originSectionId,
          taskId,
          Number(index)
        )
      );
    }
    taskPlaceholderNode?.remove();
  };

  return (
    <StyledTaskSectionBody className="task-list">
      {taskIds.map((taskId) => (
        <Task
          key={taskId}
          onClick={openTaskDetailsModal}
          taskId={taskId}
          sectionId={sectionId}
          onMouseEnter={onMouseEnterTask}
          onDragStart={onTaskStartDrag}
          onDragEnd={onTaskEndDrag}
        />
      ))}

      <div
        className="dropzone-padding"
        onMouseEnter={onMouseEnterDropZonePadding}
      >
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
