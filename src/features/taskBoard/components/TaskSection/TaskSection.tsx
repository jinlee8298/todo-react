import { DragEventHandler, useRef } from "react";
import StyledTaskSection from "./TaskSection.style";
import Task from "../Task/Task";
import { Button } from "common/components";
import { faEllipsisH, faPlus } from "@fortawesome/free-solid-svg-icons";

const TaskBoard = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const onDragStart: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };
  return (
    <StyledTaskSection ref={boardRef} draggable>
      <header>
        <h3>To dodf asdf asdf asdf asdfasd asdf asd asdfasdfasdf</h3>
        <span>143</span>
        <Button icon={faEllipsisH} size="sx" rounded alternative="reverse" />
      </header>
      <div className="task-list" draggable onDragStart={onDragStart}>
        <Task title="just a normal Title"></Task>
      </div>
      <footer draggable onDragStart={onDragStart}>
        <Button icon={faPlus} title="Add task" alternative="outline">
          Add task
        </Button>
      </footer>
    </StyledTaskSection>
  );
};

export default TaskBoard;
