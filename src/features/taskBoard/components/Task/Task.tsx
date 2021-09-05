import { FC, FormEventHandler, memo, useEffect } from "react";
import { Checkbox, Label as LabelComponent } from "common/components";
import StyledTask from "./Task.style";
import { useDispatch, useDrag, useSelector } from "common/hooks";
import { EntityId } from "@reduxjs/toolkit";
import { toggleTask } from "features/taskBoard/taskBoardSlice";
import TaskMenu from "./TaskMenu";
import { faCodeBranch, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { Label } from "features/taskBoard/types";
import { shallowEqual } from "react-redux";
import { taskSelector } from "features/taskBoard/store/taskReducer";
import { labelSelector } from "features/taskBoard/store/labelReducer";

type TaskProps = {
  taskId: EntityId;
  sectionId: EntityId;
  onDragOver?: (
    e: CustomEvent<{ position: { clientX: number; clientY: number } }>,
    taskId: EntityId
  ) => void;
  onDragEnter?: (e: Event, taskId: EntityId) => void;
  onDragStart?: (dragEle: HTMLElement, taskId: EntityId) => void;
  onDragEnd?: (dragEle: HTMLElement, taskId: EntityId) => void;
  onClick?: (taskId: EntityId) => void;
};

const Task: FC<TaskProps> = memo(({ taskId, sectionId, ...props }) => {
  const task = useSelector((state) =>
    taskSelector.selectById(state.taskBoard, taskId)
  );
  const subTaskProgress = useSelector((state) => {
    let finishedCount = 0;
    if (task) {
      task.subTaskIds.forEach((subTaskId) => {
        const subTask = taskSelector.selectById(state.taskBoard, subTaskId);
        if (subTask?.finished) {
          finishedCount++;
        }
      });
    }
    return finishedCount;
  });
  const taskLabels = useSelector((state) => {
    const labels: Label[] = [];
    task?.labelIds.forEach((labelId) => {
      const label = labelSelector.selectById(state.taskBoard, labelId);
      if (label) {
        labels.push(label);
      }
    });
    return labels;
  }, shallowEqual);
  const [, containerRef, containerProps] = useDrag<HTMLDivElement>({
    preventDrag: task?.finished,
    onDragStart: (dragEle) => {
      props.onDragStart?.(dragEle, taskId);
    },
    onDragEnd: (dragEle) => {
      props.onDragEnd?.(dragEle, taskId);
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const onDragOver = (
      e: CustomEvent<{
        position: { clientX: number; clientY: number };
      }>
    ) => {
      props.onDragOver?.(e, taskId);
    };
    const onDragEnter = (e: Event) => {
      console.log("enter");
      props.onDragEnter?.(e, taskId);
    };
    const ref = containerRef.current;
    if (ref) {
      if (props.onDragEnter) {
        ref.addEventListener("custom-dragenter", onDragEnter);
      }
      if (props.onDragOver) {
        ref.addEventListener("custom-dragover", onDragOver as EventListener);
      }
    }

    return () => {
      if (ref) {
        if (props.onDragEnter) {
          ref.removeEventListener("custom-dragenter", onDragEnter);
        }
        if (props.onDragOver) {
          ref.removeEventListener(
            "custom-dragover",
            onDragOver as EventListener
          );
        }
      }
    };
  }, [containerRef, taskId, props]);

  const onTickCheckbox: FormEventHandler<HTMLInputElement> = (e) => {
    if (task) {
      dispatch(toggleTask(sectionId, taskId));
    }
  };

  const openTaskDetailsModal = () => {
    props.onClick?.(taskId);
  };

  return task ? (
    <StyledTask
      onClick={openTaskDetailsModal}
      className={[
        task.priority !== "low" ? task.priority : "",
        task.finished ? "finished" : "",
      ].join(" ")}
      ref={containerRef}
      {...containerProps}
    >
      <h3>
        <Checkbox
          checked={task.finished ?? false}
          aria-label={`Toggle task ${task.title}`}
          onChange={onTickCheckbox}
        />
        <span>{task.title}</span>
      </h3>
      {task.description && <p>{task.description}</p>}
      <div className="task-details">
        {task.subTaskIds.length > 0 && (
          <LabelComponent
            title={`${task.subTaskIds.length} sub-task(s)`}
            icon={faCodeBranch}
          >
            {subTaskProgress} / {task.subTaskIds.length}
          </LabelComponent>
        )}
        {task.commentIds.length > 0 && (
          <LabelComponent
            title={`${task.commentIds.length} comment(s)`}
            icon={faCommentAlt}
          >
            {task.commentIds.length}
          </LabelComponent>
        )}
        {taskLabels.map((label) => (
          <LabelComponent
            to={`/label/${label.id}`}
            color={label.color}
            key={label.id}
            title={label.name}
          >
            {label.name}
          </LabelComponent>
        ))}
      </div>
      <TaskMenu
        triggerRounded={true}
        onEdit={openTaskDetailsModal}
        task={task}
      />
    </StyledTask>
  ) : null;
});

export default Task;
