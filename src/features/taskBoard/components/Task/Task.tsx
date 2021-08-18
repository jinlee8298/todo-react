import {
  FC,
  useEffect,
  useRef,
  DragEventHandler,
  FormEventHandler,
  memo,
} from "react";
import { Button, Menu, Checkbox } from "common/components";
import {
  faEllipsisH,
  faEdit,
  faCopy,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import StyledTask from "./Task.style";
import {
  useConfirmDialog,
  useDispatch,
  useMenu,
  useSelector,
} from "common/hooks";
import { EntityId } from "@reduxjs/toolkit";
import {
  taskSelector,
  deleteTask,
  duplicateTask,
  setDraggingTaskData,
  removeTaskPlaceholder,
  insertTaskPlaceholder,
  updateTask,
} from "features/taskBoard/taskBoardSlice";
import { RootState } from "app/store";
import { ConfirmDialog } from "common/components";

type TaskProps = {
  taskId: EntityId;
  sectionId: EntityId;
  onDragEnter?: DragEventHandler<HTMLDivElement>;
};

const Task: FC<TaskProps> = memo((props) => {
  const [showMenu, iconButtonRef, openMenu, closeMenu] =
    useMenu<HTMLButtonElement>();
  const [showConfirm, closeConfirm, configConfirm, confirmDialogProps] =
    useConfirmDialog();
  const task = useSelector((state: RootState) =>
    taskSelector.selectById(state.taskBoard, props.taskId)
  );
  const containerRef = useRef<HTMLDivElement>(null);
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

  const onDragStart: DragEventHandler<HTMLDivElement> = (e) => {
    if (task) {
      e.dataTransfer.setData("task", props.taskId.toString());
      e.dataTransfer.setData("text/plain", task.title);
      dispatch(
        setDraggingTaskData({
          draggingTaskId: task.id,
          originSectionId: props.sectionId,
          placeholderHeight: `${containerRef.current?.offsetHeight}px`,
        })
      );

      setTimeout(() => {
        dispatch(insertTaskPlaceholder(props.sectionId, props.taskId, null));
        containerRef.current?.classList.add("dragging");
      });
    }
  };

  const onDragEnd: DragEventHandler<HTMLDivElement> = (e) => {
    containerRef.current?.classList.remove("dragging");

    dispatch(removeTaskPlaceholder());
    dispatch(setDraggingTaskData(null));
  };

  const onDragEnter: DragEventHandler<HTMLElement> = (e) => {
    if (e.dataTransfer.types.includes("task")) {
      dispatch(insertTaskPlaceholder(props.sectionId, props.taskId, null));
    }
  };

  const onTickCheckbox: FormEventHandler<HTMLInputElement> = (e) => {
    if (task) {
      const checkboxEle = e.target as HTMLInputElement;
      dispatch(
        updateTask({ id: task.id, changes: { finished: checkboxEle.checked } })
      );
    }
  };

  const duplicateTaskHandler = () => {
    dispatch(duplicateTask(props.sectionId, task));
    closeMenu();
  };

  const deleteTaskHandler = () => {
    configConfirm({
      backdropClick: closeConfirm,
      handleClose: closeConfirm,
      onReject: closeConfirm,
      onConfirm: () => dispatch(deleteTask(props.sectionId, props.taskId)),
      title: "Delete task?",
      message: (
        <span>
          Are you sure you want to delete task: <strong>"{task?.title}"</strong>
          ?
        </span>
      ),
      acceptButtonLabel: "Delete",
      rejectButtonLabel: "Cancel",
      acceptButtonConfig: { variant: "danger" },
    });
    showConfirm();
    closeMenu();
  };

  return (
    <StyledTask
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
      ref={containerRef}
    >
      <h3>
        <Checkbox checked={task?.finished ?? false} onChange={onTickCheckbox} />
        <span>{task?.title}</span>
      </h3>
      {task?.description && <p>{task?.description}</p>}
      <div className="task-details"></div>
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
    </StyledTask>
  );
});

export default Task;
