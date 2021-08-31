import { EntityId } from "@reduxjs/toolkit";
import { DragEventHandler, FC, useState } from "react";
import { Button } from "common/components";
import StyledFooter from "./TaskSectionFooter.style";
import TaskEditor from "../../TaskEditor/TaskEditor";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type TaskSectionFooterProps = {
  sectionId: EntityId;
};
const TaskSectionFooter: FC<TaskSectionFooterProps> = (props) => {
  const [showTaskEditor, setShowTaskEditor] = useState(false);

  const preventDrag: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  const toggleTaskEditor = () => {
    setShowTaskEditor((showing) => !showing);
  };
  return (
    <StyledFooter draggable onDragStart={preventDrag}>
      {showTaskEditor ? (
        <TaskEditor
          mode="add"
          onCloseHandle={toggleTaskEditor}
          sectionId={props.sectionId}
        />
      ) : (
        <Button
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
