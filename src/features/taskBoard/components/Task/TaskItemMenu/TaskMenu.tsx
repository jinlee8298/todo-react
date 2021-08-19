import {
  faEllipsisH,
  faCopy,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FC, useRef } from "react";
import { Button, Menu, ConfirmDialog, Popover } from "common/components";
import { useDispatch, useConfirmDialog } from "common/hooks";
import { Task } from "features/taskBoard/types";
import { EntityId } from "@reduxjs/toolkit";
import { deleteTask, duplicateTask } from "features/taskBoard/taskBoardSlice";

type TaskMenuProps = {
  task: Task;
  sectionId: EntityId;
};

const TaskMenu: FC<TaskMenuProps> = (props) => {
  const [showConfirm, closeConfirm, confirmDialogProps] = useConfirmDialog();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();

  const duplicateTaskHandler = () => {
    dispatch(duplicateTask(props.sectionId, props.task));
  };

  const deleteTaskHandler = () => {
    showConfirm({
      backdropClick: closeConfirm,
      handleClose: closeConfirm,
      onReject: closeConfirm,
      onConfirm: () => dispatch(deleteTask(props.sectionId, props.task.id)),
      title: "Delete task?",
      message: (
        <span>
          Are you sure you want to delete task:{" "}
          <strong>"{props.task.title}"</strong>?
        </span>
      ),
      acceptButtonLabel: "Delete",
      rejectButtonLabel: "Cancel",
      acceptButtonConfig: { variant: "danger", icon: faTrashAlt },
    });
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
            <Menu.Item icon={faEdit}>Edit task</Menu.Item>
            <Menu.Item
              icon={faCopy}
              onTrigger={() => {
                duplicateTaskHandler();
                close();
              }}
            >
              Duplicate
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
          rounded
        />
      </Popover>

      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
};

export default TaskMenu;
