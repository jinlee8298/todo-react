import {
  faEllipsisH,
  faCopy,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FC, useEffect } from "react";
import { Button, Menu, ConfirmDialog } from "common/components";
import { useMenu, useDispatch, useConfirmDialog } from "common/hooks";
import { Task } from "features/taskBoard/types";
import { EntityId } from "@reduxjs/toolkit";
import { deleteTask, duplicateTask } from "features/taskBoard/taskBoardSlice";

type TaskMenuProps = {
  task: Task;
  sectionId: EntityId;
};

const TaskMenu: FC<TaskMenuProps> = (props) => {
  const [showMenu, iconButtonRef, openMenu, closeMenu] =
    useMenu<HTMLButtonElement>();
  const [showConfirm, closeConfirm, confirmDialogProps] = useConfirmDialog();
  const dispatch = useDispatch();

  useEffect(() => {
    if (showMenu) {
      iconButtonRef.current?.classList.add("showing");
    } else {
      // 200 is transition time for menu
      setTimeout(() => {
        iconButtonRef.current?.classList.remove("showing");
      }, 200);
    }
  }, [showMenu, iconButtonRef]);

  const duplicateTaskHandler = () => {
    dispatch(duplicateTask(props.sectionId, props.task));
    closeMenu();
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
      acceptButtonConfig: { variant: "danger" },
    });
    closeMenu();
  };

  return (
    <>
      <Button
        ref={iconButtonRef}
        size="sx"
        icon={faEllipsisH}
        onClick={openMenu}
        alternative="reverse"
        rounded
      />
      <Menu attachTo={iconButtonRef} open={showMenu} handleClose={closeMenu}>
        <Menu.Item icon={faEdit}>Edit task</Menu.Item>
        <Menu.Item icon={faCopy} onTrigger={duplicateTaskHandler}>
          Duplicate
        </Menu.Item>
        <Menu.Item
          variant="danger"
          icon={faTrashAlt}
          onTrigger={deleteTaskHandler}
        >
          Delete task
        </Menu.Item>
      </Menu>
      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
};

export default TaskMenu;
