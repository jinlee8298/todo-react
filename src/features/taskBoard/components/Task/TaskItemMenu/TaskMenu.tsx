import {
  faEllipsisH,
  faCopy,
  faTrashAlt,
  faPen,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FC, useRef } from "react";
import { Button, Menu, ConfirmDialog, Popover } from "common/components";
import { useDispatch, useConfirmDialog } from "common/hooks";
import { Task } from "features/taskBoard/types";
import { deleteTask, duplicateTask } from "features/taskBoard/taskBoardSlice";
import { useHistory, useRouteMatch } from "react-router-dom";

type TaskMenuProps = {
  task: Task;
  onEdit: () => void;
};

const TaskMenu: FC<TaskMenuProps> = ({ task, onEdit }) => {
  const [showConfirm, closeConfirm, confirmDialogProps] = useConfirmDialog();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const history = useHistory();
  const match = useRouteMatch<{
    projectId: string;
    taskId: string;
    labelId: string;
  }>(["/project/:projectId/task/:taskId", "/label/:labelId/task/:taskId"]);
  const projectId = match?.params.projectId;
  const labelId = match?.params.labelId;
  const isOnModal = !!match?.params.taskId;
  const dispatch = useDispatch();

  const duplicateTaskHandler = () => {
    if (task.commentIds.length > 0) {
      showConfirm({
        backdropClick: closeConfirm,
        onReject: () => {
          dispatch(
            duplicateTask(task.sectionId, task.parentTaskId, task.id, false)
          );
          closeConfirm();
        },
        onEsc: closeConfirm,
        onConfirm: () => {
          dispatch(
            duplicateTask(task.sectionId, task.parentTaskId, task.id, true)
          );
          closeConfirm();
        },
        title: "Duplicate comments?",
        message: <span>Do you want to duplicate comments in this task?</span>,
        acceptButtonLabel: "Duplicate comments",
        rejectButtonLabel: "Exclude comments",
      });
    } else {
      dispatch(duplicateTask(task.sectionId, task.parentTaskId, task.id));
    }
  };

  const deleteTaskHandler = () => {
    showConfirm({
      backdropClick: closeConfirm,
      onReject: closeConfirm,
      onEsc: closeConfirm,
      onConfirm: () => {
        if (isOnModal) {
          if (labelId) {
            history.push(`/label/${labelId}`);
          }
          if (projectId) {
            history.push(`/project/${projectId}`);
          }
        }

        dispatch(deleteTask(task.sectionId, task.id));
      },
      title: "Delete task?",
      message: (
        <span>
          Are you sure you want to delete task: <strong>"{task.title}"</strong>?
        </span>
      ),
      acceptButtonLabel: "Delete",
      rejectButtonLabel: "Cancel",
      acceptButtonConfig: { variant: "danger", icon: faTrashAlt },
    });
  };

  const editTaskHandler = () => {
    closeConfirm();
    onEdit();
  };

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/project/${task.projectId}/task/${task.id}`
    );
  };

  const getPopoverRef = (
    ref: HTMLDivElement | null,
    targetRef: HTMLElement | null
  ) => {
    popoverRef.current = ref;
    triggerButtonRef.current = targetRef;
  };

  const onMenuOpened = () => {
    triggerButtonRef.current?.classList.add("showing");
  };
  const onMenuClosed = () => {
    triggerButtonRef.current?.classList.remove("showing");
  };
  return (
    <>
      <Popover
        onOpenFinished={onMenuOpened}
        onCloseFinished={onMenuClosed}
        getPopoverRef={getPopoverRef}
        closeOnClickOutside={true}
        content={({ close }) => (
          <Menu>
            {!task.finished && (
              <>
                <Menu.Item
                  icon={faPen}
                  onTrigger={() => {
                    editTaskHandler();
                    close();
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  icon={faCopy}
                  onTrigger={() => {
                    duplicateTaskHandler();
                    close();
                  }}
                >
                  Duplicate
                </Menu.Item>
              </>
            )}
            <Menu.Item
              icon={faLink}
              onTrigger={() => {
                copyLinkHandler();
                close();
              }}
            >
              Copy link to task
            </Menu.Item>
            <Menu.Item
              variant="danger"
              icon={faTrashAlt}
              onTrigger={() => {
                deleteTaskHandler();
                close();
              }}
            >
              Delete task
            </Menu.Item>
          </Menu>
        )}
      >
        <Button
          className="menu-trigger"
          size="sx"
          icon={faEllipsisH}
          alternative="reverse"
          rounded={!isOnModal}
        />
      </Popover>

      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
};

export default TaskMenu;
