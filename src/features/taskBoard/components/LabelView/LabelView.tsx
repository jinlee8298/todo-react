import { useSelector } from "common/hooks";
import { labelSelector, taskSelector } from "features/taskBoard/taskBoardSlice";
import { memo, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import SubTask from "../TaskDetailsModal/SubTasksTab/SubTask/SubTask";
import TaskDetailsModal from "../TaskDetailsModal/TaskDetailsModal";
import StyledView from "./LabelView.style";

const LabelView = memo(() => {
  const match = useRouteMatch<{ id: string }>("/label/:id");
  const labelId = match?.params.id;
  const label = useSelector((state) =>
    labelSelector.selectById(state.taskBoard, labelId || "")
  );
  const taskIds = useMemo(() => {
    if (label) {
      return label.taskIds;
    }
    return [];
  }, [label]);
  const tasks = useSelector(
    (state) =>
      taskIds
        .map((id) => taskSelector.selectById(state.taskBoard, id))
        .filter((task) => task && !task.finished),
    shallowEqual
  );

  return (
    <StyledView>
      <h1>{label && label.name}</h1>
      {tasks.map(
        (task) => task && <SubTask key={task.id} task={task}></SubTask>
      )}
      <TaskDetailsModal />
    </StyledView>
  );
});

export default LabelView;
