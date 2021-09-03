import { Checkbox, Label as LabelComponent } from "common/components";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { useDispatch, useSelector } from "common/hooks";
import { labelSelector } from "features/taskBoard/store/labelReducer";
import { toggleTask, updateTask } from "features/taskBoard/taskBoardSlice";
import { Label, Task, TaskPriority } from "features/taskBoard/types";
import { FC, KeyboardEventHandler } from "react";
import { shallowEqual } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import TaskMenu from "../Task/TaskMenu";
import TaskLabelSelect from "../TaskLabelSelect/TaskLabelSelect";
import TaskPrioritySelect from "../TaskPrioritySelect/TaskPrioritySelect";
import TaskSectionSelect from "../TaskSectionSelect/TaskSectionSelect";

type TaskInfoProps = {
  task: Task;
  onEdit: () => void;
};

const TaskInfo: FC<TaskInfoProps> = ({ task, onEdit }) => {
  const taskLabels = useSelector((state) => {
    return task
      ? task.labelIds.map(
          (id) => labelSelector.selectEntities(state.taskBoard)[id]
        )
      : [];
  }, shallowEqual) as Label[];
  const match = useRouteMatch<{
    projectId: string;
    taskId: string;
    labelId: string;
  }>(["/project/:projectId/task/:taskId", "/label/:labelId/task/:taskId"]);
  const projectId = match?.params.projectId;
  const labelId = match?.params.labelId;
  const history = useHistory();
  const dispatch = useDispatch();

  const onTickCheckbox = () => {
    if (task) {
      dispatch(toggleTask(task.sectionId || undefined, task.id));
    }
  };

  const onSelectPriority = (e: SelectItem) => {
    dispatch(
      updateTask({
        id: task.id,
        changes: { priority: e.value as TaskPriority },
      })
    );
  };

  const onKeyPressEditable: KeyboardEventHandler = (e) => {
    if (e.key === "Space" || e.key === "Enter" || e.key === "NumpadEnter") {
      onEdit?.();
    }
  };

  const onDeleteTask = () => {
    if (labelId) {
      history.push(`/label/${labelId}`);
    }
    if (projectId) {
      history.push(`/project/${projectId}`);
    }
  };

  return (
    <>
      <div
        className={["task-details", task.finished ? "finished" : ""].join(" ")}
      >
        <Checkbox checked={task.finished ?? false} onChange={onTickCheckbox} />
        <div
          className="editable"
          tabIndex={0}
          onKeyPress={onKeyPressEditable}
          onClick={onEdit}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
        </div>
      </div>
      <div className="label-wrapper">
        {taskLabels.map((label) => (
          <LabelComponent
            to={`/label/${label.id}`}
            color={label.color}
            key={label.id}
            title={label.name}
          >
            {label.name}
          </LabelComponent>
        ))}
      </div>
      <div className="task-actions">
        <TaskSectionSelect disabled={task.finished} task={task} />
        <TaskLabelSelect
          disabled={task.finished}
          taskId={task.id}
          mode="standalone"
        />
        <TaskPrioritySelect
          disabled={task.finished}
          onSelect={onSelectPriority}
          taskId={task.id}
        />
        <TaskMenu
          triggerRounded={false}
          onDelete={onDeleteTask}
          onEdit={onEdit}
          task={task}
        />
      </div>
    </>
  );
};

export default TaskInfo;
