import { DragEventHandler, FC, useRef, memo, useState } from "react";
import StyledTaskSection from "./TaskSection.style";
import { EntityId } from "@reduxjs/toolkit";
import {
  sectionSelector,
  removeTaskPlaceholder,
  insertSectionPlaceholder,
  removeSectionPlaceholder,
  setDraggingSectionData,
} from "../../taskBoardSlice";
import { useDispatch, useSelector } from "common/hooks";
import TaskSectionFooter from "./TaskSectionFooter/TaskSectionFooter";
import TaskSectionBody from "./TaskSectionBody/TaskSectionBody";
import TaskSectionMenu from "./TaskSectionMenu/TaskSectionMenu";
import TaskSecitonEditor from "./TaskSectionEditor/TaskSectionEditor";

type TaskSectionProps = {
  sectionId: EntityId;
  projectId: EntityId;
};

const TaskSection: FC<TaskSectionProps> = memo((props) => {
  const section = useSelector((state) =>
    sectionSelector.selectById(state.taskBoard, props.sectionId)
  );
  const containerRef = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);
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

  const toggleEditing = () => {
    setEditing((v) => !v);
  };
  return (
    <StyledTaskSection
      draggable={!editing}
      ref={containerRef}
      onDragEnter={onDragEnterSection}
      onDragStart={onDragStartSection}
      onDragEnd={onDragEndSection}
      onDragOver={onSectionDragOver}
      onDragLeave={onDragLeave}
    >
      <header>
        {editing ? (
          <TaskSecitonEditor
            onCloseHandle={toggleEditing}
            section={section}
            projectId={props.projectId}
          />
        ) : (
          <>
            <h3 onClick={toggleEditing}>{section?.name}</h3>
            <span>
              {section?.taskIds.filter((id) => id !== "placeholder").length}
            </span>
            {section && (
              <TaskSectionMenu
                onEdit={toggleEditing}
                sectionId={section.id}
                projectId={props.projectId}
              />
            )}
          </>
        )}
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
