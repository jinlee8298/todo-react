import { Checkbox, Label as LabelComponent } from "common/components";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { useDispatch, useSelector } from "common/hooks";
import { labelSelector } from "features/taskBoard/store/labelReducer";
import { toggleTask, updateTask } from "features/taskBoard/taskBoardSlice";
import { Label, Task, TaskPriority } from "features/taskBoard/types";
import { FC, KeyboardEventHandler } from "react";
import { shallowEqual } from "react-redux";
import TaskMenu from "../../Task/TaskItemMenu/TaskMenu";
import TaskLabelSelect from "../../TaskEditor/TaskLabelSelect/TaskLabelSelect";
import TaskPrioritySelect from "../../TaskEditor/TaskPrioritySelect/TaskPrioritySelect";

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
        <TaskMenu onEdit={onEdit} task={task} />
      </div>
    </>
  );
};

export default TaskInfo;
