import { Checkbox } from "common/components";
import StyledSubTask from "./SubTask.style";

const SubTask = () => {
  return (
    <StyledSubTask>
      <h3>
        <Checkbox />
        <span>Task title</span>
      </h3>
      <p>Task description</p>
      <div className="task-details"></div>
    </StyledSubTask>
  );
};

export default SubTask;
