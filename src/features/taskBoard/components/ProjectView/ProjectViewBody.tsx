import { useDispatch, useSelector } from "common/hooks";
import { removeTaskPlaceholder } from "features/taskBoard/taskBoardSlice";
import { Project } from "features/taskBoard/types";
import { DragEventHandler, FC, Fragment, useState } from "react";
import Placeholder from "../Placeholder/Placeholder";
import TaskSection from "../TaskSection/TaskSection";
import TaskSectionEditor from "../TaskSection/TaskSectionEditor/TaskSectionEditor";
import AddSectionTrigger from "../AddSectionButton/AddSectionButton";
import { Button } from "common/components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type ProjectViewBodyProps = {
  project: Project;
};

const ProjectViewBody: FC<ProjectViewBodyProps> = ({ project }) => {
  const dispatch = useDispatch();
  const draggingSectionInfo = useSelector(
    (state) => state.taskBoard.sections.draggingInfo
  );
  const [addingSection, setAddingSection] = useState(false);
  const [addSectionIndex, setAddSectionIndex] = useState(-1);

  const toggleAddingSection = () => {
    setAddingSection((v) => !v);
  };

  const onDragEnterListbox: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.currentTarget === e.target) {
      dispatch(removeTaskPlaceholder());
    }
  };

  const cancelAddSectionInBetween = () => {
    setAddSectionIndex(-1);
  };

  const addSectionInBetween = (addIndex: number) => {
    setAddSectionIndex(addIndex);
  };
  return (
    <div role="listbox" onDragEnter={onDragEnterListbox}>
      <div className="dropzone-padding"></div>
      {project.sectionIds.map((id, index) => (
        <Fragment key={id}>
          {id === "placeholder" ? (
            <Placeholder
              height={draggingSectionInfo?.placeholderHeight ?? "100%"}
            />
          ) : (
            <TaskSection key={id} sectionId={id} projectId={project.id} />
          )}
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
