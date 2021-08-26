import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, ColorPicker } from "common/components";
import { TextInput } from "common/components";
import { COLOR_LIST } from "common/constants";
import { useInput } from "common/hooks";
import { Color } from "common/types";
import { addProject, updateProject } from "features/taskBoard/taskBoardSlice";
import { Project } from "features/taskBoard/types";
import { FC, KeyboardEventHandler, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import StyledModal from "./ProjectEditModal.style";

type AddProjectModalProps = {
  isShown: boolean;
  project: Project | null;
  onCloseHandle?: () => void;
};

const AddProjectModal: FC<AddProjectModalProps> = ({
  isShown,
  project,
  ...props
}) => {
  const [projectName, errors, resetName, onChange, setProjectName] = useInput(
    "",
    {
      maxLength: { value: 120 },
    }
  );
  const [color, setColor] = useState<Color>(COLOR_LIST[0]);
  const isError = useMemo(() => {
    return Object.values(errors).filter((v) => v).length > 0;
  }, [errors]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setColor(
        COLOR_LIST.find(({ color }) => color === project.color) || COLOR_LIST[0]
      );
    }
  }, [project, setProjectName]);

  const onCloseHandle = () => {
    resetName();
    props.onCloseHandle?.();
  };

  const addNewProject = () => {
    const trimmedName = projectName.trim();
    if (trimmedName && !isError) {
      dispatch(addProject({ name: trimmedName, color: color.color }));
      onCloseHandle();
    }
  };

  const updateProjectHandler = () => {
    const trimmedName = projectName.trim();
    if (trimmedName && !isError && project) {
      const projectChangeObj: Partial<Project> = {};
      if (project.name !== trimmedName) {
        projectChangeObj.name = trimmedName;
      }
      if (project.color !== color.color) {
        projectChangeObj.color = color.color;
      }
      dispatch(updateProject({ id: project.id, changes: projectChangeObj }));
      onCloseHandle();
    }
  };

  const onEsc: KeyboardEventHandler = (e) => {
    if (e.code === "Escape") {
      onCloseHandle();
    }
    if (
      ["Enter", "NumpadEnter"].includes(e.code) &&
      projectName.trim() &&
      !isError
    ) {
      addNewProject();
    }
  };

  const onColorPick = (color: Color) => {
    setColor(color);
  };

  return (
    <StyledModal
      onKeyDown={onEsc}
      backdropClick={onCloseHandle}
      isShown={isShown}
    >
      <div className="header">
        <h2>Add project</h2>
        <Button
          onClick={onCloseHandle}
          icon={faTimes}
          size="sx"
          alternative="reverse"
          rounded
        />
      </div>
      <TextInput
        autoFocus
        value={projectName}
        label="Name"
        onChange={onChange}
        errors={errors}
      />
      <ColorPicker
        selectedColor={color}
        onColorPick={onColorPick}
        label="Color"
      />
      <div className="action">
        <Button onClick={onCloseHandle} size="sm" alternative="reverse">
          Cancel
        </Button>
        <Button
          disabled={!projectName.trim() || isError}
          onClick={project ? updateProjectHandler : addNewProject}
          size="sm"
        >
          {project ? "Update" : "Add"}
        </Button>
      </div>
    </StyledModal>
  );
};

export default AddProjectModal;
