import {
  faEllipsisH,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ConfirmDialog, Menu, Popover } from "common/components";
import { Button } from "common/components";
import { useConfirmDialog, useDispatch } from "common/hooks";
import { deleteLabel } from "features/taskBoard/taskBoardSlice";
import { Label } from "features/taskBoard/types";
import { FC, useRef } from "react";

type LabelMenuProps = {
  label: Label;
  onEdit: () => void;
};

const LabelMenu: FC<LabelMenuProps> = ({ label, onEdit }) => {
  const [showConfirm, closeConfirm, confirmDialogProps] = useConfirmDialog();
  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();

  const deleteLabelHandler = () => {
    showConfirm({
      backdropClick: closeConfirm,
      onReject: closeConfirm,
      onEsc: closeConfirm,
      onConfirm: () => {
        dispatch(deleteLabel(label.id));
      },
      title: "Delete label?",
      message: (
        <span>
          Are you sure you want to delete label: <strong>"{label.name}"</strong>
          ?
        </span>
      ),
      acceptButtonLabel: "Delete",
      rejectButtonLabel: "Cancel",
      acceptButtonConfig: { variant: "danger", icon: faTrashAlt },
    });
  };

  const editLabelHandler = () => {
    closeConfirm();
    onEdit();
  };

  const getPopoverRef = (
    ref: HTMLDivElement | null,
    targetRef: HTMLElement | null
  ) => {
    triggerButtonRef.current = targetRef;
  };

  const onMenuOpened = () => {
    triggerButtonRef.current?.classList.add("showing");
  };
  const onMenuClosed = () => {
    triggerButtonRef.current?.classList.remove("showing");
  };

  const popoverContent = (action: { close: () => void }) => (
    <Menu>
      <Menu.Item
        icon={faPen}
        onTrigger={() => {
          editLabelHandler();
          action.close();
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        variant="danger"
        icon={faTrashAlt}
        onTrigger={() => {
          deleteLabelHandler();
          action.close();
        }}
      >
        Delete label
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Popover
        onOpenFinished={onMenuOpened}
        onCloseFinished={onMenuClosed}
        getPopoverRef={getPopoverRef}
        closeOnClickOutside
        content={popoverContent}
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

export default LabelMenu;
