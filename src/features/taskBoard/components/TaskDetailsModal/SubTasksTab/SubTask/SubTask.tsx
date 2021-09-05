import { faCodeBranch, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Label as LabelComponent } from "common/components";
import { useDispatch, useSelector } from "common/hooks";
import TaskMenu from "features/taskBoard/components/Task/TaskMenu";
import TaskEditor from "features/taskBoard/components/TaskEditor/TaskEditor";
import { labelSelector } from "features/taskBoard/store/labelReducer";
import { taskSelector } from "features/taskBoard/store/taskReducer";
import { toggleTask } from "features/taskBoard/taskBoardSlice";
import { Label, Task } from "features/taskBoard/types";
import { FC, useState, memo, MouseEventHandler, FormEventHandler } from "react";
import { shallowEqual } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import StyledSubTask from "./SubTask.style";

type SubTaskProps = {
  task: Task;
};

const SubTask: FC<SubTaskProps> = memo(({ task }) => {
  const subTaskProgress = useSelector((state) => {
    let finishedCount = 0;
    if (task) {
      task.subTaskIds.forEach((subTaskId) => {
        const subTask = taskSelector.selectById(state.taskBoard, subTaskId);
        if (subTask?.finished) {
          finishedCount++;
        }
      });
    }
    return finishedCount;
  });
  const [editing, setEditing] = useState(false);
  const taskLabels = useSelector((state) => {
    const labels: Label[] = [];
    task?.labelIds.forEach((labelId) => {
      const label = labelSelector.selectById(state.taskBoard, labelId);
      if (label) {
        labels.push(label);
      }
    });
    return labels;
  }, shallowEqual);
  const match = useRouteMatch<{
    projectId: string;
    labelId: string;
    taskId: string;
  }>([
    "/project/:projectId/task/:taskId",
    "/label/:labelId/task/:taskId",
    "/project/:projectId",
    "/label/:labelId",
  ]);
  const history = useHistory();
  const projectId = match?.params.projectId;
  const labelId = match?.params.labelId;
  const dispatch = useDispatch();

  const toggleEditing = () => {
    setEditing((v) => !v);
  };

  const onClickTask: MouseEventHandler = (e) => {
    e.stopPropagation();
    if (labelId) {
      history.push(`/label/${labelId}/task/${task.id}`);
    }
    if (projectId) {
      history.push(`/project/${projectId}/task/${task.id}`);
    }
  };

  const onClickEditor: MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const onTickCheckbox: FormEventHandler<HTMLInputElement> = (e) => {
    if (task) {
      dispatch(toggleTask(task.sectionId, task.id));
    }
  };

  return task ? (
    <StyledSubTask
      onClick={onClickTask}
      className={[
        task.priority !== "low" ? task.priority : "",
        task.finished ? "finished" : "",
      ].join(" ")}
    >
      {editing ? (
        <TaskEditor
          onClick={onClickEditor}
          onCloseHandle={toggleEditing}
          task={task}
          mode="edit"
        ></TaskEditor>
      ) : (
        <>
          <h3>
            <Checkbox
              checked={task.finished ?? false}
              onChange={onTickCheckbox}
            />
            <span>{task.title}</span>
          </h3>
          {task.description && <p>{task.description}</p>}
          <div className="task-details">
            {task.subTaskIds.length > 0 && (
              <LabelComponent
                title={`${task.subTaskIds.length} sub-task(s)`}
                icon={faCodeBranch}
              >
                {subTaskProgress} / {task.subTaskIds.length}
              </LabelComponent>
            )}
            {task.commentIds.length > 0 && (
              <LabelComponent
                title={`${task.commentIds.length} comment(s)`}
                icon={faCommentAlt}
              >
                {task.commentIds.length}
              </LabelComponent>
            )}
            {taskLabels.map((label) => (
              <LabelComponent
                color={label.color}
                key={label.id}
                title={label.name}
              >
                {label.name}
              </LabelComponent>
            ))}
          </div>
          <TaskMenu triggerRounded={true} onEdit={toggleEditing} task={task} />
        </>
      )}
    </StyledSubTask>
  ) : null;
});

export default SubTask;
