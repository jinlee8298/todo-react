import { EntityId } from "@reduxjs/toolkit";
import { TextInput, Button } from "common/components";
import { useDispatch, useInput } from "common/hooks";
import { addSection, updateSection } from "features/taskBoard/taskBoardSlice";
import { TaskSection } from "features/taskBoard/types";
import { FC } from "react";
import StyledEditor from "./TaskSectionEditor.style";

type TaskSectionEditorProps = {
  projectId: EntityId;
  section?: TaskSection;
  onCloseHandle?: () => void;
};
const TaskSecitonEditor: FC<TaskSectionEditorProps> = ({
  section,
  onCloseHandle,
  projectId,
}) => {
  const [sectionName, errors, resetName, onNameChange] = useInput(
    section ? section.name : "",
    { maxLength: { value: 500 } }
  );
  const dispatch = useDispatch();
  const saveChange = () => {
    if (section && section.name !== sectionName && sectionName.trim()) {
      dispatch(
        updateSection({ id: section.id, changes: { name: sectionName } })
      );
    }
    onCloseHandle?.();
  };
  const addNewSection = () => {
    if (sectionName.trim()) {
      dispatch(addSection(projectId, { name: sectionName }));
    }
    onCloseHandle?.();
  };

  return (
    <StyledEditor>
      <TextInput
        autoFocus
        label="Name"
        value={sectionName}
        errors={errors}
        onChange={onNameChange}
      />
      <Button
        onClick={section ? saveChange : addNewSection}
        disabled={!sectionName.trim()}
        size="sm"
      >
        Save
      </Button>
      <Button onClick={onCloseHandle} alternative="reverse" size="sm">
        Cancel
      </Button>
    </StyledEditor>
  );
};

export default TaskSecitonEditor;
