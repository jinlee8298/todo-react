import { EntityId } from "@reduxjs/toolkit";
import { FC, useState } from "react";
import { Button } from "common/components";
import StyledFooter from "./TaskSectionFooter.style";
import TaskEditor from "../../TaskEditor/TaskEditor";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type TaskSectionFooterProps = {
  sectionId: EntityId;
};
const TaskSectionFooter: FC<TaskSectionFooterProps> = (props) => {
  const [showTaskEditor, setShowTaskEditor] = useState(false);

  const toggleTaskEditor = () => {
    setShowTaskEditor((showing) => !showing);
  };
  return (
    <StyledFooter>
      {showTaskEditor ? (
        <TaskEditor
          mode="add"
          onCloseHandle={toggleTaskEditor}
          sectionId={props.sectionId}
        />
      ) : (
        <Button
          aria-label="Add task"
          icon={faPlus}
          title="Add task"
          alternative="outline"
          onClick={toggleTaskEditor}
        >
          Add task
        </Button>
      )}
    </StyledFooter>
  );
};

export default TaskSectionFooter;
