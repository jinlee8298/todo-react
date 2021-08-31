import {
  faCopy,
  faEllipsisH,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import { Popover, Menu, Button, ConfirmDialog } from "common/components";
import { useConfirmDialog, useDispatch, useSelector } from "common/hooks";
import { FC } from "react";
import {
  deleteSection,
  duplicateSection,
} from "features/taskBoard/taskBoardSlice";
import { sectionSelector } from "features/taskBoard/store/sectionReducer";

type TaskMenuProps = {
  sectionId: EntityId;
  projectId: EntityId;
  onEdit?: () => void;
};

const TaskSectionMenu: FC<TaskMenuProps> = ({
  sectionId,
  projectId,
  onEdit,
}) => {
  const section = useSelector((state) =>
    sectionSelector.selectById(state.taskBoard, sectionId)
  );
  const [showConfirm, closeConfirm, confirmDialogProps] = useConfirmDialog();
  const dispatch = useDispatch();

  const handleDuplicateSection = () => {
    dispatch(duplicateSection(projectId, sectionId));
  };

  const handleDeleteSection = () => {
    if (!section) {
      return;
    }

    showConfirm({
      backdropClick: closeConfirm,
      onReject: closeConfirm,
      onEsc: closeConfirm,
      onConfirm: () => {
        dispatch(deleteSection(projectId, sectionId));
      },
      title: "Delete task?",
      message:
        section.taskIds.length > 0 ? (
          <span>
            Delete <strong>{section.name}</strong> with its{" "}
            <strong>{section.taskIds.length}</strong> tasks?
          </span>
        ) : (
          <span>
            Are you sure you want to delete <strong>{section.name}</strong>?
          </span>
        ),
      acceptButtonLabel: "Delete",
      rejectButtonLabel: "Cancel",
      acceptButtonConfig: { variant: "danger", icon: faTrashAlt },
    });
  };
  return (
    <>
      <Popover
        closeOnClickOutside={true}
        content={({ close }) => (
          <Menu>
            <Menu.Item
              icon={faPen}
              onTrigger={() => {
                onEdit?.();
                close();
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              icon={faCopy}
              onTrigger={() => {
                handleDuplicateSection();
                close();
              }}
            >
              Duplicate
            </Menu.Item>
            <Menu.Item
              variant="danger"
              icon={faTrashAlt}
              onTrigger={() => {
                handleDeleteSection();
                close();
              }}
            >
              Delete section
            </Menu.Item>
          </Menu>
        )}
      >
        <Button icon={faEllipsisH} size="sx" rounded alternative="reverse" />
      </Popover>

      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
};

export default TaskSectionMenu;
