import StyledSubTasksTab from "./SubTasksTab.style";
import TaskEditor from "../../TaskEditor/TaskEditor";
import { Button } from "common/components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import SubTask from "./SubTask/SubTask";

const SubTasksTab = () => {
  const [addTask, setAddTask] = useState<boolean>(false);

  const toggleAddTask = () => {
    setAddTask((v) => !v);
  };
  return (
    <StyledSubTasksTab>
      <SubTask></SubTask>
      {addTask ? (
        <TaskEditor onCancel={toggleAddTask} sectionId="asdfa" mode="add" />
      ) : (
        <button onClick={toggleAddTask}>
          <FontAwesomeIcon icon={faPlus} />
          Add sub-task
        </button>
      )}
    </StyledSubTasksTab>
  );
};

export default SubTasksTab;
