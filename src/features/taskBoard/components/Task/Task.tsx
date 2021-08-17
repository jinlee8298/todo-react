import {
  FC,
  useEffect,
  useRef,
  useState,
  DragEventHandler,
  Fragment,
  useLayoutEffect,
  FormEventHandler,
} from "react";
import { Button, Menu, Checkbox, Label } from "common/components";
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
  positionIndex: number;
};

const Task: FC<TaskProps> = (props) => {
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
      e.dataTransfer.setData("text/plain", task.title);
      e.dataTransfer.setData("taskId", task.id.toString());
      e.dataTransfer.setData("originSectionId", props.sectionId.toString());

      dispatch(
        setDraggingTaskData({
          taskId: task.id,
          sectionId: props.sectionId,
          placeholderHeight: `${containerRef.current?.offsetHeight}px`,
        })
      );

      setTimeout(() => {
        dispatch(insertTaskPlaceholder(props.sectionId, props.positionIndex));
        containerRef.current?.classList.add("dragging");
      });
    }
  };

  const onDragEnd: DragEventHandler<HTMLDivElement> = (e) => {
    containerRef.current?.classList.remove("dragging");

    dispatch(removeTaskPlaceholder());
    dispatch(setDraggingTaskData(null));
  };

  const onTickCheckbox: FormEventHandler<HTMLInputElement> = (e) => {
    if (task) {
      const checkboxEle = e.target as HTMLInputElement;
      dispatch(
        updateTask({ id: task.id, changes: { finished: checkboxEle.checked } })
      );
    }
  };
  return (
    <StyledTask
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragEnter={props.onDragEnter}
      ref={containerRef}
    >
      <h3>
        <Checkbox checked={task?.finished} onChange={onTickCheckbox} />
        <span>{task?.title}</span>
      </h3>
      {task?.description && <p>{task?.description}</p>}
      <div className="task-details">
        {/* <Label icon={faHospital}>20 Aug 2022</Label>
      <Label icon={faPlus}>20 Aug 2022</Label> */}
      </div>
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
        <Menu.Item
          icon={faCopy}
          onClick={(e) => {
            dispatch(duplicateTask(props.sectionId, task, props.positionIndex));
            closeMenu();
          }}
        >
          Duplicate
        </Menu.Item>
        <Menu.Item
          variant="danger"
          icon={faTrash}
          onClick={(e) => dispatch(deleteTask(props.sectionId, props.taskId))}
        >
          Delete task
        </Menu.Item>
      </Menu>
    </StyledTask>
  );
};

export default Task;
