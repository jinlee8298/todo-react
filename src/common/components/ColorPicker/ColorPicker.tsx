import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLOR_LIST } from "common/constants";
import { Color } from "common/types";
import { FC } from "react";
import { Popover } from "../index";
import {
  ColorButton,
  ColorPickerContainer,
  ColorPickerPopover,
} from "./ColorPicker.style";

type ColorPickerProps = {
  label?: string;
  selectedColor: Color;
  onColorPick: (color: Color) => void;
};

const ColorPicker: FC<ColorPickerProps> = ({
  label,
  selectedColor,
  onColorPick,
}) => {
  const popoverContent = (
    <ColorPickerPopover>
      {COLOR_LIST.map(({ color, name }) => (
        <ColorButton
          key={color}
          className={selectedColor.color === color ? "selected" : ""}
          autoFocus={selectedColor.color === color}
          onClick={onColorPick.bind(null, { color, name })}
          style={{ background: color }}
          title={name}
        >
          <FontAwesomeIcon icon={faCheck} fixedWidth />
        </ColorButton>
      ))}
    </ColorPickerPopover>
  );

  return (
    <ColorPickerContainer>
      <p>{label}</p>
      <Popover closeOnClickOutside content={popoverContent}>
        <button>
          <div
            className="color-indicator"
            style={{ background: selectedColor.color }}
          ></div>
          <span>{selectedColor.name}</span>
        </button>
      </Popover>
    </ColorPickerContainer>
  );
};

export default ColorPicker;
