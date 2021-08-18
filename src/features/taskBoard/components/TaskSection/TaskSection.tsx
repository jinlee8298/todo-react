import { DragEventHandler, FC, useRef, memo } from "react";
import StyledTaskSection from "./TaskSection.style";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import {
  sectionSelector,
  removeTaskPlaceholder,
  insertSectionPlaceholder,
  removeSectionPlaceholder,
  setDraggingSectionData,
} from "../../taskBoardSlice";
import { Button } from "common/components";
import { useDispatch, useSelector } from "common/hooks";
import TaskSectionFooter from "./TaskSectionFooter/TaskSectionFooter";
import TaskSectionBody from "./TaskSectionBody/TaskSectionBody";

type TaskSectionProps = {
  sectionId: EntityId;
  projectId: EntityId;
};

const TaskSection: FC<TaskSectionProps> = memo((props) => {
  const section = useSelector((state) =>
    sectionSelector.selectById(state.taskBoard, props.sectionId)
  );
  const containerRef = useRef<HTMLElement>(null);
  const dispatch = useDispatch();

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

  const onDragLeave: DragEventHandler<HTMLElement> = (e) => {
    if (e.currentTarget === e.target) {
      dispatch(removeTaskPlaceholder());
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
      onDragLeave={onDragLeave}
    >
      <header>
        <h3>{section?.name}</h3>
        <span>
          {section?.taskIds.filter((id) => id !== "placeholder").length}
        </span>
        <Button icon={faEllipsisH} size="sx" rounded alternative="reverse" />
      </header>
      <TaskSectionBody
        sectionId={props.sectionId}
        taskIds={section?.taskIds ?? []}
      />
      <TaskSectionFooter sectionId={props.sectionId} />
    </StyledTaskSection>
  );
});

export default TaskSection;
