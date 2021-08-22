import { faPen } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import { Button, Checkbox } from "common/components";
import { useDispatch, useSelector } from "common/hooks";
import TaskEditor from "features/taskBoard/components/TaskEditor/TaskEditor";
import {
  setCurrentViewTaskId,
  taskSelector,
} from "features/taskBoard/taskBoardSlice";
import { FC, useState, memo } from "react";
import StyledSubTask from "./SubTask.style";

type SubTaskProps = {
  taskId: EntityId;
};

const SubTask: FC<SubTaskProps> = memo(({ taskId }) => {
  const task = useSelector((state) =>
    taskSelector.selectById(state.taskBoard, taskId)
  );
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();

  const toggleEditing = () => {
    setEditing((v) => !v);
  };

  const onClick = () => {
    dispatch(setCurrentViewTaskId(taskId));
  };

  return task ? (
    <StyledSubTask
      onClick={onClick}
      className={task.priority !== "low" ? task.priority : ""}
    >
      {editing ? (
        <TaskEditor
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
          <Button
            onClick={toggleEditing}
            size="sx"
            alternative="reverse"
            icon={faPen}
            rounded
          />
        </>
      )}
    </StyledSubTask>
  ) : null;
});

export default SubTask;
