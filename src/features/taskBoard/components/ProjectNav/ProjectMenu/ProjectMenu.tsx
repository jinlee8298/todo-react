import {
  faCopy,
  faEllipsisH,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ConfirmDialog, Menu, Popover } from "common/components";
import { Button } from "common/components";
import { useConfirmDialog, useDispatch } from "common/hooks";
import {
  deleteProject,
  deleteSection,
  duplicateProject,
} from "features/taskBoard/taskBoardSlice";
import { Project } from "features/taskBoard/types";
import { FC, useRef } from "react";

type ProjectMenuProps = {
  project: Project;
  onEdit: () => void;
};

const ProjectMenu: FC<ProjectMenuProps> = ({ project, onEdit }) => {
  const [showConfirm, closeConfirm, confirmDialogProps] = useConfirmDialog();
  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();

  const deleteProjectHandler = () => {
    showConfirm({
      backdropClick: closeConfirm,
      onReject: closeConfirm,
      onEsc: closeConfirm,
      onConfirm: () => {
        project.sectionIds.forEach((sectionId) => {
          dispatch(deleteSection(project.id, sectionId));
        });
        dispatch(deleteProject(project.id));
      },
      title: "Delete project?",
      message: (
        <span>
          Are you sure you want to delete project:{" "}
          <strong>"{project.name}"</strong>?
        </span>
      ),
      acceptButtonLabel: "Delete",
      rejectButtonLabel: "Cancel",
      acceptButtonConfig: { variant: "danger", icon: faTrashAlt },
    });
  };

  const duplicateProjectHandler = () => {
    dispatch(duplicateProject(project.id));
    closeConfirm();
  };

  const editProjectHandler = () => {
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
          editProjectHandler();
          action.close();
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        icon={faCopy}
        onTrigger={() => {
          duplicateProjectHandler();
          action.close();
        }}
      >
        Duplicate
      </Menu.Item>
      <Menu.Item
        variant="danger"
        icon={faTrashAlt}
        onTrigger={() => {
          deleteProjectHandler();
          action.close();
        }}
      >
        Delete project
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

export default ProjectMenu;