import StyledSubTasksTab from "./SubTasksTab.style";
import TaskEditor from "../../TaskEditor/TaskEditor";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState, memo } from "react";
import SubTask from "./SubTask/SubTask";
import { EntityId } from "@reduxjs/toolkit";
import { useSelector } from "common/hooks";
import { taskSelector } from "features/taskBoard/taskBoardSlice";

type SubTasksTabProps = {
  parentTaskId: EntityId;
};

const SubTasksTab: FC<SubTasksTabProps> = memo(({ parentTaskId }) => {
  const [addTask, setAddTask] = useState<boolean>(false);
  const subTaskIds = useSelector(
    (state) =>
      taskSelector.selectById(state.taskBoard, parentTaskId)?.subTaskIds
  );

  const toggleAddTask = () => {
    setAddTask((v) => !v);
  };
  return (
    <StyledSubTasksTab>
      {subTaskIds?.map((id) => (
        <SubTask key={id} taskId={id}></SubTask>
      ))}

      {addTask ? (
        <TaskEditor
          onCancel={toggleAddTask}
          parentTaskId={parentTaskId}
          mode="add-subtask"
        />
      ) : (
        <button onClick={toggleAddTask}>
          <FontAwesomeIcon icon={faPlus} />
          Add sub-task
        </button>
      )}
    </StyledSubTasksTab>
  );
});

export default SubTasksTab;
