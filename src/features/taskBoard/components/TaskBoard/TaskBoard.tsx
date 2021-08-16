import StyledTaskBoard from "./TaskBoard.style";
import TaskSection from "../TaskSection/TaskSection";
import AddSectionTrigger from "../AddSectionButton/AddSectionButton";
import { FC } from "react";
import { Button } from "common/components";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";

type TaskBoardProps = {};

const TaskBoard: FC<TaskBoardProps> = (props) => {
  return (
    <StyledTaskBoard>
      <TaskSection />
      <AddSectionTrigger />
      <Button alternative="reverse" icon={faPlusSquare}>
        Add new section
      </Button>
    </StyledTaskBoard>
  );
};

export default TaskBoard;
