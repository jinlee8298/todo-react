import StyledModal from "./TaskDetailsModal.style";
import { Button, Tabs } from "common/components";
import {
  FC,
  useState,
  memo,
  useEffect,
  KeyboardEventHandler,
  useCallback,
} from "react";
import {
  faCodeBranch,
  faDotCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskEditor from "../TaskEditor/TaskEditor";
import SubTasksTab from "./SubTasksTab/SubTasksTab";
import CommentsTab from "./CommentsTab/CommentsTab";
import { useConfirmDialog, useSelector } from "common/hooks";
import { ConfirmDialog } from "common/components";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { taskSelector } from "features/taskBoard/store/taskReducer";
import { projectSelector } from "features/taskBoard/store/projectReducer";
import TaskInfo from "./TaskInfo/TaskInfo";
import { labelSelector } from "features/taskBoard/store/labelReducer";

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
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const taskId = match?.params.taskId;
  const task = useSelector((state) => {
    if (taskId) {
      return taskSelector.selectById(state.taskBoard, taskId);
    }
  });
  const projectId = match?.params.projectId || task?.projectId;
  const labelId = match?.params.labelId;
  const labelName = useSelector((state) => {
    if (labelId) {
      const label = labelSelector.selectById(state.taskBoard, labelId);
      return label?.name;
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
  const [showConfirm, closeConfirm, dialogProps] = useConfirmDialog();

  const toggleEdit = () => {
    if (!task?.finished) {
      setIsEdit((v) => !v);
    }
  };

  const onCloseModal = useCallback(() => {
    const handleClose = () => {
      if (labelId) {
        history.push(`/label/${labelId}`);
      } else {
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

  const redirectLink = () => {
    if (task?.parentTaskId) {
      const linkFirstPart = labelId
        ? `/label/${labelId}`
        : `/project/${projectId}`;
      return `${linkFirstPart}/task/${task.parentTaskId}`;
    }
    return `/project/${projectId}`;
  };

  useEffect(() => {
    setIsEdit(false);
  }, [taskId]);

  useEffect(() => {
    if (!isShown) {
      setIsEdit(false);
    }
    setTimeout(() => {
      if (isShown) {
        document.title = `Task: ${task?.title}`;
      } else {
        if (labelName) {
          document.title = `Label: ${labelName}`;
        } else {
          document.title = `Project: ${projectName}`;
        }
      }
    });
  }, [isShown, labelName, projectName, task?.title]);

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
          <TaskInfo task={task} onEdit={toggleEdit} />
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
