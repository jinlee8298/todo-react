import { faCommentAlt, faLink } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import { Checkbox, Label as LabelComponent } from "common/components";
import { useDispatch, useSelector } from "common/hooks";
import TaskMenu from "features/taskBoard/components/Task/TaskItemMenu/TaskMenu";
import TaskEditor from "features/taskBoard/components/TaskEditor/TaskEditor";
import {
  labelSelector,
  setCurrentViewTaskId,
  taskSelector,
} from "features/taskBoard/taskBoardSlice";
import { Label } from "features/taskBoard/types";
import { FC, useState, memo, MouseEventHandler } from "react";
import { shallowEqual } from "react-redux";
import StyledSubTask from "./SubTask.style";

type SubTaskProps = {
  taskId: EntityId;
};

const SubTask: FC<SubTaskProps> = memo(({ taskId }) => {
  const task = useSelector((state) =>
    taskSelector.selectById(state.taskBoard, taskId)
  );
  const [editing, setEditing] = useState(false);
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
  const dispatch = useDispatch();

  const toggleEditing = () => {
    setEditing((v) => !v);
  };

  const onClickTask: MouseEventHandler = (e) => {
    e.stopPropagation();
    dispatch(setCurrentViewTaskId(taskId));
  };

  const onClickEditor: MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  return task ? (
    <StyledSubTask
      onClick={onClickTask}
      className={task.priority !== "low" ? task.priority : ""}
    >
      {editing ? (
        <TaskEditor
          onClick={onClickEditor}
          onCancel={toggleEditing}
          task={task}
          mode="edit"
        ></TaskEditor>
      ) : (
        <>
          <h3>
            <Checkbox />
            <span>{task.title}</span>
          </h3>
          {task.description && <p>{task.description}</p>}
          <div className="task-details">
            {task.subTaskIds.length > 0 && (
              <LabelComponent
                title={`${task.subTaskIds.length} sub-task(s)`}
                icon={faLink}
              >
                {task.subTaskIds.length}
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
              <LabelComponent key={label.id} title={label.name}>
                {label.name}
              </LabelComponent>
            ))}
          </div>
          <TaskMenu onEdit={toggleEditing} task={task} />
        </>
      )}
    </StyledSubTask>
  ) : null;
});

export default SubTask;
