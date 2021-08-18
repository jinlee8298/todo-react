import { DragEventHandler, FC, DragEvent, useRef, memo } from "react";
import StyledTaskSection from "./TaskSection.style";
import Task from "../Task/Task";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import {
  sectionSelector,
  repositionTask,
  insertTaskPlaceholder,
  removeTaskPlaceholder,
  insertSectionPlaceholder,
  removeSectionPlaceholder,
  setDraggingSectionData,
} from "../../taskBoardSlice";
import { useSelector } from "react-redux";
import { RootState } from "app/store";
import { Button } from "common/components";
import { useDispatch } from "common/hooks";
import Placeholder from "../Placeholder/Placeholder";
import TaskSectionFooter from "./TaskSectionFooter/TaskSectionFooter";

type TaskSectionProps = {
  sectionId: EntityId;
  projectId: EntityId;
};

const TaskSection: FC<TaskSectionProps> = memo((props) => {
  const section = useSelector((state: RootState) =>
    sectionSelector.selectById(state.taskBoard, props.sectionId)
  );
  const draggingInfo = useSelector(
    (state: RootState) => state.taskBoard.tasks.draggingInfo
  );
  const containerRef = useRef<HTMLElement>(null);
  const dispatch = useDispatch();

  const preventDrag: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  const onDragEnterTaskList: DragEventHandler<HTMLElement> = (e) => {
    if (e.dataTransfer.types.includes("task")) {
      e.preventDefault();

      const nonDraggingTaskIds = section?.taskIds.filter(
        (id) => id !== draggingInfo?.draggingTaskId
      );
      if (nonDraggingTaskIds?.length === 0) {
        dispatch(insertTaskPlaceholder(props.sectionId, null, 0));
        return;
      }

      const targetEl = e.target as HTMLDivElement;
      if (targetEl.classList.contains("dropzone-padding")) {
        dispatch(
          insertTaskPlaceholder(props.sectionId, null, section?.taskIds.length)
        );
      }
    }
  };

  const onDragOverTaskList = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const onTaskDrop: DragEventHandler<HTMLElement> = (e) => {
    e.preventDefault();

    const taskId = draggingInfo?.draggingTaskId;
    const originSectionId = draggingInfo?.originSectionId;
    const taskIndex = section?.taskIds.indexOf("placeholder");

    dispatch(
      repositionTask(props.sectionId, originSectionId, taskId, taskIndex)
    );

    if (originSectionId !== draggingInfo?.currentPlaceholderSecionId) {
      dispatch(removeTaskPlaceholder());
    }
  };

  const onSectionDragOver: DragEventHandler<HTMLElement> = (e) => {
    if (e.dataTransfer.types.includes("section")) {
      e.preventDefault();
    }
  };

  const onDragStartSection: DragEventHandler<HTMLElement> = (e) => {
    if (e.target === e.currentTarget) {
      e.dataTransfer.setData("section", props.sectionId.toString());
      e.dataTransfer.setData("text/plain", section?.name ?? "");

      dispatch(
        setDraggingSectionData({
          draggingSectionId: props.sectionId,
          placeholderHeight: `${containerRef.current?.offsetHeight}px`,
        })
      );

      setTimeout(() => {
        dispatch(
          insertSectionPlaceholder(props.projectId, props.sectionId, null)
        );
        containerRef.current?.classList.add("dragging");
      });
    }
  };

  const onDragEndSection: DragEventHandler<HTMLDivElement> = (e) => {
    containerRef.current?.classList.remove("dragging");

    dispatch(removeSectionPlaceholder(props.projectId));
    dispatch(setDraggingSectionData(null));
  };

  const onDragEnterSection: DragEventHandler<HTMLElement> = (e) => {
    if (e.dataTransfer.types.includes("section")) {
      dispatch(
        insertSectionPlaceholder(props.projectId, props.sectionId, null)
      );
    }
  };
  return (
    <StyledTaskSection
      draggable
      ref={containerRef}
      onDragEnter={onDragEnterSection}
      onDragStart={onDragStartSection}
      onDragEnd={onDragEndSection}
      onDragOver={onSectionDragOver}
    >
      <header>
        <h3>{section?.name}</h3>
        <span>{section?.taskIds.length}</span>
        <Button icon={faEllipsisH} size="sx" rounded alternative="reverse" />
      </header>
      <div
        className="task-list"
        draggable
        onDrop={onTaskDrop}
        onDragStart={preventDrag}
        onDragOver={onDragOverTaskList}
        onDragEnter={onDragEnterTaskList}
      >
        {section?.taskIds.map((taskId) =>
          taskId === "placeholder" ? (
            <Placeholder
              key="placeholder"
              height={draggingInfo ? draggingInfo.placeholderHeight : "0px"}
            />
          ) : (
            <Task key={taskId} taskId={taskId} sectionId={props.sectionId} />
          )
        )}
        <div className="dropzone-padding"></div>
      </div>
      <TaskSectionFooter sectionId={props.sectionId} />
    </StyledTaskSection>
  );
});

export default TaskSection;
