import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, ColorPicker, TextInput } from "common/components";
import { COLOR_LIST } from "common/constants";
import { useDispatch, useInput } from "common/hooks";
import { Color } from "common/types";
import { addLabel, updateLabel } from "features/taskBoard/taskBoardSlice";
import { Label } from "features/taskBoard/types";
import { FC, KeyboardEventHandler, useEffect, useMemo, useState } from "react";
import StyledModal from "./LabelEditModal.style";

type LabelEditModalProps = {
  label: Label | null;
  isShown: boolean;
  onCloseHandle?: () => void;
};

const LabelEditModal: FC<LabelEditModalProps> = ({
  label,
  isShown,
  ...props
}) => {
  const [labelName, errors, resetName, onChange, setLabelName] = useInput("", {
    maxLength: { value: 120 },
  });
  const [color, setColor] = useState<Color>(COLOR_LIST[0]);
  const isError = useMemo(() => {
    return Object.values(errors).filter((v) => v).length > 0;
  }, [errors]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (label) {
      setLabelName(label.name);
      setColor(
        COLOR_LIST.find(({ color }) => color === label.color) || COLOR_LIST[0]
      );
    }
  }, [label, setLabelName]);

  const onCloseHandle = () => {
    props.onCloseHandle?.();
    setColor(COLOR_LIST[0]);
    resetName();
  };

  const addNewLabel = () => {
    const trimmedName = labelName.trim();
    if (trimmedName && !isError) {
      dispatch(addLabel({ name: trimmedName, color: color.color }));
      onCloseHandle();
    }
  };

  const updateLabelHandler = () => {
    const trimmedName = labelName.trim();
    if (trimmedName && !isError && label) {
      const labelChangeObj: Partial<Label> = {};
      if (label.name !== trimmedName) {
        labelChangeObj.name = trimmedName;
      }
      if (label.color !== color.color) {
        labelChangeObj.color = color.color;
      }
      dispatch(updateLabel({ id: label.id, changes: labelChangeObj }));
      onCloseHandle();
    }
  };

  const onEsc: KeyboardEventHandler = (e) => {
    if (e.code === "Escape") {
      onCloseHandle();
    }
  };

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (
      ["Enter", "NumpadEnter"].includes(e.code) &&
      labelName.trim() &&
      !isError
    ) {
      e.stopPropagation();
      label ? updateLabelHandler() : addNewLabel();
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
        <h2>{label ? "Edit" : "Add"} label</h2>
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
        value={labelName}
        label="Name"
        onChange={onChange}
        onKeyDown={onKeyDown}
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
          disabled={!labelName.trim() || isError}
          onClick={label ? updateLabelHandler : addNewLabel}
          size="sm"
        >
          {label ? "Update" : "Add"}
        </Button>
      </div>
    </StyledModal>
  );
};

export default LabelEditModal;
