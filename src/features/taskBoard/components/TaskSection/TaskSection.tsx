import { FC, memo, useState, MouseEventHandler, useEffect } from "react";
import StyledTaskSection from "./TaskSection.style";
import { EntityId } from "@reduxjs/toolkit";
import { useDrag, useSelector } from "common/hooks";
import TaskSectionFooter from "./TaskSectionFooter/TaskSectionFooter";
import TaskSectionBody from "./TaskSectionBody/TaskSectionBody";
import TaskSectionMenu from "./TaskSectionMenu/TaskSectionMenu";
import TaskSecitonEditor from "./TaskSectionEditor/TaskSectionEditor";
import { sectionSelector } from "features/taskBoard/store/sectionReducer";

type TaskSectionProps = {
  sectionId: EntityId;
  projectId: EntityId;
  onMouseEnter?: (
    e: React.MouseEvent<Element, MouseEvent>,
    sectionId: EntityId
  ) => void;
  onDragStart?: (dragEle: HTMLElement, sectionId: EntityId) => void;
  onDragEnd?: (dragEle: HTMLElement, sectionId: EntityId) => void;
  onTouchEnter?: (e: Event, sectionId: EntityId) => void;
};

const TaskSection: FC<TaskSectionProps> = memo(
  ({ sectionId, projectId, onDragStart, onDragEnd, ...props }) => {
    const section = useSelector((state) =>
      sectionSelector.selectById(state.taskBoard, sectionId)
    );
    const [editing, setEditing] = useState(false);
    const [, containerRef, dragProps] = useDrag<HTMLElement>({
      preventDrag: editing,
      onDragStart: (dragEle) => {
        onDragStart?.(dragEle, sectionId);
      },
      onDragEnd: (dragEle) => {
        onDragEnd?.(dragEle, sectionId);
      },
    });

    const toggleEditing = () => {
      setEditing((v) => !v);
    };

    const onMouseEnter: MouseEventHandler = (e) => {
      props.onMouseEnter?.(e, sectionId);
    };

    useEffect(() => {
      const onTouchEnter = (e: Event) => {
        props.onTouchEnter?.(e, sectionId);
      };
      const ref = containerRef.current;
      if (props.onTouchEnter && ref) {
        ref.setAttribute("data-touchable", "true");
        ref.addEventListener("touchenter", onTouchEnter);
      }
      return () => {
        if (props.onTouchEnter && ref) {
          ref.removeEventListener("touchenter", onTouchEnter);
        }
      };
    }, [containerRef, sectionId, props]);

    return (
      <StyledTaskSection
        role="group"
        onMouseEnter={onMouseEnter}
        ref={containerRef}
      >
        <header {...dragProps}>
          {editing ? (
            <TaskSecitonEditor
              onCloseHandle={toggleEditing}
              section={section}
              projectId={projectId}
            />
          ) : (
            <>
              <h2 onClick={toggleEditing}>{section?.name}</h2>
              <span>
                {section?.taskIds.filter((id) => id !== "placeholder").length}
              </span>
              {section && (
                <TaskSectionMenu
                  onEdit={toggleEditing}
                  sectionId={section.id}
                  projectId={projectId}
                />
              )}
            </>
          )}
        </header>
        <TaskSectionBody
          sectionId={sectionId}
          taskIds={section?.taskIds ?? []}
          finishedTaskIds={section?.finishedTaskIds ?? []}
        />
        <TaskSectionFooter sectionId={sectionId} />
      </StyledTaskSection>
    );
  }
);

export default TaskSection;
