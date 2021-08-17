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
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import StyledTask from "./Task.style";
import { useDispatch, useMenu, useSelector } from "common/hooks";
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

type TaskProps = {
  taskId: EntityId;
  sectionId: EntityId;
  onDragEnter?: DragEventHandler<HTMLDivElement>;
};

const Task: FC<TaskProps> = memo((props) => {
  const [showMenu, iconButtonRef, openMenu, closeMenu] =
    useMenu<HTMLButtonElement>();
  const task = useSelector((state: RootState) =>
    taskSelector.selectById(state, props.taskId)
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

  const onDragEnterTask: DragEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(insertTaskPlaceholder(props.sectionId, props.taskId, null));
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
    dispatch(deleteTask(props.sectionId, props.taskId));
    closeMenu();
  };

  return (
    <StyledTask
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnterTask}
      ref={containerRef}
    >
      <h3>
        <Checkbox checked={task?.finished} onChange={onTickCheckbox} />
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
          icon={faTrash}
          onTrigger={deleteTaskHandler}
        >
          Delete task
        </Menu.Item>
      </Menu>
    </StyledTask>
  );
});

export default Task;
