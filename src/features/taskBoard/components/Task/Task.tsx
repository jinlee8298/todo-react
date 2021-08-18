import { FC, useRef, DragEventHandler, FormEventHandler, memo } from "react";
import { Checkbox } from "common/components";
import StyledTask from "./Task.style";
import { useDispatch, useSelector } from "common/hooks";
import { EntityId } from "@reduxjs/toolkit";
import {
  taskSelector,
  setDraggingTaskData,
  removeTaskPlaceholder,
  insertTaskPlaceholder,
  updateTask,
} from "features/taskBoard/taskBoardSlice";
import { RootState } from "app/store";
import TaskMenu from "./TaskItemMenu/TaskMenu";

type TaskProps = {
  taskId: EntityId;
  sectionId: EntityId;
  onDragEnter?: DragEventHandler<HTMLDivElement>;
};

const Task: FC<TaskProps> = memo((props) => {
  const task = useSelector((state: RootState) =>
    taskSelector.selectById(state.taskBoard, props.taskId)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const onDragStart: DragEventHandler<HTMLDivElement> = (e) => {
    if (task) {
      e.dataTransfer.setData("task", props.taskId.toString());
      e.dataTransfer.setData("text/plain", task.title);
      dispatch(
        setDraggingTaskData({
          draggingTaskId: task.id,
          originSectionId: props.sectionId,
          placeholderHeight: `${containerRef.current?.offsetHeight}px`,
        })
      );

      setTimeout(() => {
        dispatch(insertTaskPlaceholder(props.sectionId, props.taskId, null));
        containerRef.current?.classList.add("dragging");
      });
    }
  };

  const onDragEnd: DragEventHandler<HTMLDivElement> = (e) => {
    containerRef.current?.classList.remove("dragging");

    dispatch(removeTaskPlaceholder());
    dispatch(setDraggingTaskData(null));
  };

  const onDragEnter: DragEventHandler<HTMLElement> = (e) => {
    if (e.dataTransfer.types.includes("task")) {
      dispatch(insertTaskPlaceholder(props.sectionId, props.taskId, null));
    }
  };

  const onTickCheckbox: FormEventHandler<HTMLInputElement> = (e) => {
    if (task) {
      const checkboxEle = e.target as HTMLInputElement;
      dispatch(
        updateTask({ id: task.id, changes: { finished: checkboxEle.checked } })
      );
    }
  };

  return task ? (
    <StyledTask
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
      ref={containerRef}
    >
      <h3>
        <Checkbox checked={task?.finished ?? false} onChange={onTickCheckbox} />
        <span>{task?.title}</span>
      </h3>
      {task?.description && <p>{task?.description}</p>}
      <div className="task-details"></div>
      <TaskMenu sectionId={props.sectionId} task={task} />
    </StyledTask>
  ) : null;
});

export default Task;
