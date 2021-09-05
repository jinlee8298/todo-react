import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, KeyboardEventHandler, MouseEventHandler, memo } from "react";
import StyledItem from "./SelectItem.style";

export type SelectItem = {
  label: string;
  value: string;
  icon?: IconProp;
  iconColor?: string;
  isGroupLabel?: boolean;
};

type SelectItemProps = {
  isSelected?: boolean;
  value: SelectItem;
  onSelect?: (value: SelectItem) => void;
  onDeselect?: (value: SelectItem) => void;
};

const Item: FC<SelectItemProps> = memo(
  ({ value, isSelected, onSelect, onDeselect }) => {
    const onClick: MouseEventHandler<HTMLLIElement> = (e) => {
      isSelected ? onDeselect?.(value) : onSelect?.(value);
    };

    const onKeyDown: KeyboardEventHandler<HTMLLIElement> = (e) => {
      if (["Space", "Enter", "NumpadEnter"].includes(e.code)) {
        e.preventDefault();
        isSelected ? onDeselect?.(value) : onSelect?.(value);
      }
    };
    return value.isGroupLabel ? (
      <StyledItem className="group-label" tabIndex={-1}>
        {value.label}
      </StyledItem>
    ) : (
      <StyledItem
        className={isSelected ? "selected" : ""}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <span>
          {value.icon && (
            <FontAwesomeIcon
              icon={value.icon}
              color={value.iconColor}
              fixedWidth
            />
          )}
          {value.label}
        </span>
        {isSelected && <FontAwesomeIcon icon={faCheck} fixedWidth />}
      </StyledItem>
    );
  }
);

export default Item;
