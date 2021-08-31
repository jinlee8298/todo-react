import StyledSubTasksTab from "./SubTasksTab.style";
import TaskEditor from "../../TaskEditor/TaskEditor";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState, memo, useMemo } from "react";
import SubTask from "./SubTask/SubTask";
import { EntityId } from "@reduxjs/toolkit";
import { useSelector } from "common/hooks";
import { shallowEqual } from "react-redux";
import { taskSelector } from "features/taskBoard/store/taskReducer";

type SubTasksTabProps = {
  parentTaskId: EntityId;
  parentTaskFinished: boolean;
};

const SubTasksTab: FC<SubTasksTabProps> = memo(
  ({ parentTaskId, parentTaskFinished }) => {
    const [addTask, setAddTask] = useState<boolean>(false);
    const subTaskIds = useSelector(
      (state) =>
        taskSelector.selectById(state.taskBoard, parentTaskId)?.subTaskIds
    );
    const tasks = useSelector(
      (store) =>
        subTaskIds?.map((id) => taskSelector.selectById(store.taskBoard, id)),
      shallowEqual
    );

    const unfinishedTask = useMemo(() => {
      if (tasks) {
        return tasks.filter((task) => !task?.finished);
      }
      return [];
    }, [tasks]);

    const finishedTask = useMemo(() => {
      if (tasks) {
        return tasks.filter((task) => task?.finished);
      }
      return [];
    }, [tasks]);

    const toggleAddTask = () => {
      setAddTask((v) => !v);
    };
    return (
      <StyledSubTasksTab>
        {unfinishedTask.map(
          (task) => task && <SubTask key={task.id} task={task}></SubTask>
        )}
        {!parentTaskFinished &&
          (addTask ? (
            <TaskEditor
              onCloseHandle={toggleAddTask}
              parentTaskId={parentTaskId}
              mode="add-subtask"
            />
          ) : (
            <button onClick={toggleAddTask}>
              <FontAwesomeIcon icon={faPlus} />
              Add sub-task
            </button>
          ))}
        {finishedTask.map(
          (task) => task && <SubTask key={task.id} task={task}></SubTask>
        )}
      </StyledSubTasksTab>
    );
  }
);

export default SubTasksTab;
