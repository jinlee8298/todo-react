import StyledModal from "./TaskDetailsModal.style";
import {
  Button,
  Checkbox,
  Label as LabelComponent,
  Tabs,
} from "common/components";
import {
  FC,
  useState,
  memo,
  useEffect,
  FormEventHandler,
  KeyboardEventHandler,
  useCallback,
} from "react";
import {
  faCodeBranch,
  faDotCircle,
  faEllipsisH,
  faList,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskEditor from "../TaskEditor/TaskEditor";
import SubTasksTab from "./SubTasksTab/SubTasksTab";
import CommentsTab from "./CommentsTab/CommentsTab";
import {
  labelSelector,
  projectSelector,
  taskSelector,
  toggleTask,
  updateTask,
} from "features/taskBoard/taskBoardSlice";
import { useConfirmDialog, useDispatch, useSelector } from "common/hooks";
import { ConfirmDialog } from "common/components";
import TaskPrioritySelect from "../TaskEditor/TaskPrioritySelect/TaskPrioritySelect";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { Label, TaskPriority } from "features/taskBoard/types";
import TaskLabelSelect from "../TaskEditor/TaskLabelSelect/TaskLabelSelect";
import { shallowEqual } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";

const TaskDetailsModal: FC = memo(() => {
  const match = useRouteMatch<{
    projectId: string;
    taskId: string;
    labelId: string;
  }>([
    "/label/:labelId/task/:taskId",
    "/label/:labelId",
    "/project/:projectId/task/:taskId",
    "/project/:projectId",
  ]);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const taskId = match?.params.taskId;
  const projectId = match?.params.projectId;
  const labelId = match?.params.labelId;
  const sectionId = sessionStorage.getItem("currentSectionId");
  const task = useSelector((state) => {
    if (taskId) {
      return taskSelector.selectById(state.taskBoard, taskId);
    }
  });
  const projectName = useSelector((state) => {
    if (projectId) {
      const currentProject = projectSelector.selectById(
        state.taskBoard,
        projectId
      );
      return currentProject?.name;
    }
  });
  const parentTaskTitle = useSelector((state) => {
    if (task && task.parentTaskId) {
      const parentTask = taskSelector.selectById(
        state.taskBoard,
        task.parentTaskId
      );
      return parentTask?.title;
    }
  });
  const isShown = !!task ?? false;
  const taskLabels = useSelector((state) => {
    return task
      ? task.labelIds.map(
          (id) => labelSelector.selectEntities(state.taskBoard)[id]
        )
      : task;
  }, shallowEqual) as Label[] | undefined;
  const [showConfirm, closeConfirm, dialogProps] = useConfirmDialog();

  useEffect(() => {
    setIsEdit(false);
  }, [taskId]);

  useEffect(() => {
    if (!isShown) {
      setIsEdit(false);
    }
  }, [isShown]);

  const toggleEdit = () => {
    if (!task?.finished) {
      setIsEdit((v) => !v);
    }
  };

  const onTickCheckbox: FormEventHandler<HTMLInputElement> = (e) => {
    if (task) {
      dispatch(toggleTask(sectionId, taskId));
    }
  };
  const onCloseModal = useCallback(() => {
    const handleClose = () => {
      if (labelId) {
        history.push(`/label/${labelId}`);
      }
      if (projectId) {
        history.push(`/project/${projectId}`);
      }
    };

    if (isEdit) {
      showConfirm({
        title: "Dicard changes?",
        message: "The changes you've made won't be saved",
        acceptButtonLabel: "Discard",
        rejectButtonLabel: "Cancel",
        onConfirm: () => {
          closeConfirm();
          handleClose();
        },
        backdropClick: closeConfirm,
        onEsc: closeConfirm,
        onReject: closeConfirm,
      });
    } else {
      handleClose();
    }
  }, [showConfirm, closeConfirm, history, projectId, labelId, isEdit]);

  const onEscape: KeyboardEventHandler = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onCloseModal();
      }
    },
    [onCloseModal]
  );

  const onKeyPressEditable: KeyboardEventHandler = (e) => {
    if (e.key === "Space" || e.key === "Enter" || e.key === "NumpadEnter") {
      toggleEdit();
    }
  };

  const onSelectPriority = (e: SelectItem) => {
    if (task) {
      dispatch(
        updateTask({
          id: task.id,
          changes: { priority: e.value as TaskPriority },
        })
      );
    }
  };

  const redirectLink = () => {
    const linkFirstPart = labelId
      ? `/label/${labelId}`
      : `/project/${projectId}`;
    if (task?.parentTaskId) {
      return `${linkFirstPart}/task/${task.parentTaskId}`;
    }
    return `${linkFirstPart}`;
  };

  return task ? (
    <StyledModal
      onKeyDown={onEscape}
      backdropClick={onCloseModal}
      isShown={isShown}
    >
      <div className="header">
        <Link to={redirectLink()}>
          <FontAwesomeIcon
            icon={task.parentTaskId ? faCodeBranch : faDotCircle}
            fixedWidth
          />
          <span>{task.parentTaskId ? parentTaskTitle : projectName}</span>
        </Link>
        <Button
          icon={faTimes}
          alternative={"reverse"}
          size="sx"
          rounded
          onClick={onCloseModal}
        />
      </div>
      <div className="edit-task">
        {isEdit ? (
          <TaskEditor
            task={task}
            mode="edit"
            onCloseHandle={toggleEdit}
          ></TaskEditor>
        ) : (
          <>
            <div
              className={["task-details", task.finished ? "finished" : ""].join(
                " "
              )}
            >
              <Checkbox
                checked={task.finished ?? false}
                onChange={onTickCheckbox}
              />
              <div
                className="editable"
                tabIndex={0}
                onKeyPress={onKeyPressEditable}
                onClick={toggleEdit}
              >
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
            </div>
            <div className="label-wrapper">
              {taskLabels?.map((label) => (
                <LabelComponent
                  color={label.color}
                  key={label.id}
                  title={label.name}
                >
                  {label.name}
                </LabelComponent>
              ))}
            </div>
            <div className="task-actions">
              <Button icon={faList} alternative="reverse" size="sx" />
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
              <Button icon={faEllipsisH} alternative="reverse" size="sx" />
            </div>
          </>
        )}
      </div>
      {taskId && (
        <Tabs renderActiveTabPanelOnly>
          <Tabs.Tab
            id="Sub-tasks"
            title="Sub-tasks"
            content={
              <SubTasksTab
                parentTaskFinished={!!task.finished}
                parentTaskId={taskId}
              />
            }
          />
          <Tabs.Tab
            id="Comments"
            title="Comments"
            content={<CommentsTab taskId={taskId} />}
          />
        </Tabs>
      )}
      <ConfirmDialog {...dialogProps} />
    </StyledModal>
  ) : null;
});

export default TaskDetailsModal;
