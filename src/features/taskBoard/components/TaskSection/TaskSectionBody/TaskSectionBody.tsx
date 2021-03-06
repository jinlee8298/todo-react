import { EntityId } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "common/hooks";
import { repositionTask } from "features/taskBoard/taskBoardSlice";
import { FC, useCallback, MouseEventHandler, useRef, useEffect } from "react";
import StyledTaskSectionBody from "./TaskSectionBody.style";
import Task from "../../Task/Task";
import { useHistory, useRouteMatch } from "react-router-dom";
import { projectSelector } from "features/taskBoard/store/projectReducer";
import useScrollAtEdge from "common/hooks/useScrollAtEdge";

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
  const dropZonePaddingRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollAtEdge(
    {
      scrollY: {
        threshold: 50,
        intervalDistance: 50,
      },
    },
    containerRef
  );
  const dispatch = useDispatch();

  const openTaskDetailsModal = useCallback(
    (taskId: EntityId) => {
      history.push(`/project/${projectId}/task/${taskId}`);
    },
    [history, projectId]
  );

  const onDragEnterTask = (e: Event, taskId: EntityId) => {
    if (draggingTask) {
      const taskIndex = taskIds.indexOf(taskId);
      taskPlaceholderNode.dataset.sectionId = sectionId.toString();
      taskPlaceholderNode.dataset.index = taskIndex.toString();
      const currentTarget = e.currentTarget as HTMLElement;
      const parentEle = currentTarget.parentElement;
      parentEle?.insertBefore(taskPlaceholderNode, currentTarget);
    }
  };

  const insertPlaceholderBottom: MouseEventHandler = (e) => {
    if (draggingTask) {
      const taskIndex = taskIds.length;
      taskPlaceholderNode.dataset.sectionId = sectionId.toString();
      taskPlaceholderNode.dataset.index = taskIndex.toString();
      const parentEle = e.currentTarget.parentElement;
      parentEle?.insertBefore(taskPlaceholderNode, e.currentTarget);
    }
  };

  // Insert placeholer immediately at dragging task
  const onTaskStartDrag = (dragEle: HTMLElement, taskId: EntityId) => {
    draggingTask = true;
    const taskIndex = taskIds.indexOf(taskId);
    taskPlaceholderNode.dataset.taskId = taskId.toString();
    taskPlaceholderNode.dataset.sectionId = sectionId.toString();
    taskPlaceholderNode.dataset.originSectionId = sectionId.toString();
    taskPlaceholderNode.dataset.index = taskIndex.toString();
    taskPlaceholderNode.style.height = `${dragEle.offsetHeight}px`;
    const parentEle = dragEle.parentElement;
    parentEle?.insertBefore(taskPlaceholderNode, dragEle.nextSibling);
  };

  // Reposition task and remove placeholder
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

  useEffect(() => {
    const ref = dropZonePaddingRef.current;
    const insertPlaceholderAtBottom = (e: Event) => {
      if (draggingTask && e.currentTarget) {
        const taskIndex = taskIds.length;
        taskPlaceholderNode.dataset.sectionId = sectionId.toString();
        taskPlaceholderNode.dataset.index = taskIndex.toString();
        const currentTarget = e.currentTarget as HTMLElement;
        const parentEle = currentTarget.parentElement;
        parentEle?.insertBefore(taskPlaceholderNode, currentTarget);
      }
    };
    if (ref) {
      ref.addEventListener("custom-dragenter", insertPlaceholderAtBottom);
    }
    return () => {
      if (ref) {
        ref.removeEventListener("custom-dragenter", insertPlaceholderAtBottom);
      }
    };
  }, [dropZonePaddingRef, sectionId, taskIds]);

  return (
    <StyledTaskSectionBody ref={containerRef} className="task-list">
      {taskIds.map((taskId) => (
        <Task
          key={taskId}
          onClick={openTaskDetailsModal}
          taskId={taskId}
          sectionId={sectionId}
          onDragStart={onTaskStartDrag}
          onDragEnd={onTaskEndDrag}
          onDragEnter={onDragEnterTask}
        />
      ))}

      <div
        ref={dropZonePaddingRef}
        className="dropzone-padding"
        onMouseEnter={insertPlaceholderBottom}
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
