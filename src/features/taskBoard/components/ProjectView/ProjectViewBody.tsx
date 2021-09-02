import { useDispatch } from "common/hooks";
import { repositionSection } from "features/taskBoard/taskBoardSlice";
import { Project } from "features/taskBoard/types";
import { FC, Fragment, useState } from "react";
import TaskSection from "../TaskSection/TaskSection";
import TaskSectionEditor from "../TaskSection/TaskSectionEditor/TaskSectionEditor";
import AddSectionTrigger from "../AddSectionButton/AddSectionButton";
import { Button } from "common/components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";

type ProjectViewBodyProps = {
  project: Project;
};

let draggingSection = false;

const sectionPlaceholderNode: HTMLElement = document.createElement("div");
sectionPlaceholderNode.classList.add("placeholder");

const ProjectViewBody: FC<ProjectViewBodyProps> = ({ project }) => {
  const dispatch = useDispatch();
  const [addingSection, setAddingSection] = useState(false);
  const [addSectionIndex, setAddSectionIndex] = useState(-1);

  const toggleAddingSection = () => {
    setAddingSection((v) => !v);
  };

  const cancelAddSectionInBetween = () => {
    setAddSectionIndex(-1);
  };

  const addSectionInBetween = (addIndex: number) => {
    setAddSectionIndex(addIndex);
  };

  const onSectionDragStart = (dragEle: HTMLElement, sectionId: EntityId) => {
    draggingSection = true;
    const sectionIndex = project.sectionIds.indexOf(sectionId);
    sectionPlaceholderNode.dataset.sectionId = sectionId.toString();
    sectionPlaceholderNode.dataset.index = sectionIndex.toString();
    sectionPlaceholderNode.style.height = `${dragEle.offsetHeight}px`;
    const parent = dragEle.parentElement;
    parent?.insertBefore(sectionPlaceholderNode, dragEle.nextSibling);
  };

  const onSectionDragEnd = () => {
    draggingSection = false;
    const dataset = sectionPlaceholderNode.dataset;
    const sectionId = dataset.sectionId;
    const index = dataset.index;
    if (sectionId && index) {
      dispatch(repositionSection(project.id, sectionId, Number(index)));
    }
    sectionPlaceholderNode?.remove();
  };

  const onMouseEnterSection = (
    e: React.MouseEvent<Element, MouseEvent>,
    sectionId: EntityId
  ) => {
    if (draggingSection) {
      const sectionIndex = project.sectionIds.indexOf(sectionId) + 1;
      sectionPlaceholderNode.dataset.index = sectionIndex.toString();
      const currentTarget = e.currentTarget;
      currentTarget.insertAdjacentElement("afterend", sectionPlaceholderNode);
    }
  };

  const onMouseEnterDropZonePadding = (
    e: React.MouseEvent<Element, MouseEvent>
  ) => {
    if (draggingSection) {
      sectionPlaceholderNode.dataset.index = "0";
      const currentTarget = e.currentTarget;
      currentTarget.insertAdjacentElement("afterend", sectionPlaceholderNode);
    }
  };

  return (
    <div role="listbox">
      <div
        className="dropzone-padding"
        onMouseEnter={onMouseEnterDropZonePadding}
      ></div>
      {project.sectionIds.map((id, index) => (
        <Fragment key={id}>
          <TaskSection
            onDragStart={onSectionDragStart}
            onDragEnd={onSectionDragEnd}
            onMouseEnter={onMouseEnterSection}
            key={id}
            sectionId={id}
            projectId={project.id}
          />
          {index !== project.sectionIds.length - 1 &&
            (addSectionIndex === index ? (
              <TaskSectionEditor
                insertIndex={index + 1}
                projectId={project.id}
                onCloseHandle={cancelAddSectionInBetween}
              />
            ) : (
              <AddSectionTrigger
                onClick={addSectionInBetween.bind(null, index)}
              />
            ))}
        </Fragment>
      ))}
      {addingSection ? (
        <TaskSectionEditor
          projectId={project.id}
          onCloseHandle={toggleAddingSection}
        />
      ) : (
        <Button
          onClick={toggleAddingSection}
          alternative="reverse"
          icon={faPlus}
        >
          Add new section
        </Button>
      )}
    </div>
  );
};

export default ProjectViewBody;
