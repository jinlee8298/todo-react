import StyledSelect from "./Select.style";
import { ChangeEventHandler, FC, ReactElement, useRef } from "react";
import Popover from "../Popover/Popover";
import { TextInput } from "common/components";
import Item, { SelectItem } from "./SelectItem/SelectItem";
import { useInput } from "common/hooks";

type SelecProps = {
  items?: SelectItem[];
  children?: ReactElement;
  hasFilter?: boolean;
  filterLabel?: string;
  selected?: SelectItem | SelectItem[];
  closeOnSelect?: boolean;
  onSelect?: (selectItem: SelectItem) => void;
  onDeselect?: (deselectItem: SelectItem) => void;
  onFilterChange?: (filterValue: string) => void;
};

const Select: FC<SelecProps> = ({
  items = [],
  children,
  hasFilter,
  filterLabel,
  selected,
  closeOnSelect,
  onDeselect,
  ...props
}) => {
  const [filterValue, , resetFilter, onFilterChange] = useInput("");
  const menuContainerRef = useRef<HTMLUListElement>(null);
  const childRefs = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef<number>(0);
  const closeSelectRef = useRef<(() => void) | null>(null);

  const moveUp = () => {
    const currentIndex = currentFocusIndex.current;
    if (currentIndex > 0) {
      childRefs.current[currentIndex - 1].focus();
    } else {
      childRefs.current[childRefs.current.length - 1].focus();
    }
  };

  const moveDown = () => {
    const currentIndex = currentFocusIndex.current;
    if (currentIndex < childRefs.current.length - 1) {
      childRefs.current[currentIndex + 1].focus();
    } else {
      childRefs.current[0].focus();
    }
  };

  const childFocused = (e: FocusEvent) => {
    currentFocusIndex.current = childRefs.current.indexOf(
      e.target as HTMLLIElement
    );
  };

  const onKeypress = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    if (!childRefs.current.includes(target)) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveDown();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveUp();
    }

    if (e.key === "Home") {
      e.preventDefault();
      childRefs.current[0].focus();
    }

    if (e.key === "End") {
      e.preventDefault();
      childRefs.current[childRefs.current.length - 1].focus();
    }
  };

  const setupKeyboardInteraction = () => {
    const currentMenuRef = menuContainerRef.current;

    const menuChilds: HTMLLIElement[] = [];
    if (currentMenuRef) {
      currentMenuRef
        .querySelectorAll<HTMLLIElement>("li:not(:disabled), input")
        .forEach((child) => menuChilds.push(child));
    }
    childRefs.current = menuChilds;

    currentMenuRef?.addEventListener("keydown", onKeypress);

    childRefs.current.forEach((child) =>
      child.addEventListener("focus", childFocused)
    );
  };

  const removeKeyboardListener = () => {
    resetFilter();
    childRefs.current.forEach((child) =>
      child.removeEventListener("focus", childFocused)
    );
    menuContainerRef.current?.removeEventListener("keydown", onKeypress);
  };

  const checkSelected = (checkItem: SelectItem) => {
    if (!selected) {
      return false;
    }
    if (Array.isArray(selected)) {
      const index = selected.findIndex((selectedItem) => {
        return selectedItem.value === checkItem.value;
      });
      return index >= 0;
    } else {
      return selected.value === checkItem.value;
    }
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onFilterChange(e);
    props?.onFilterChange?.(e.target.value);
  };

  const onSelect = (value: SelectItem) => {
    if (closeSelectRef.current && closeOnSelect) {
      closeSelectRef.current();
    }
    props?.onSelect?.(value);
  };

  const renderContent = ({ close }: { close: () => void }) => {
    closeSelectRef.current = close;
    return (
      <>
        <StyledSelect role="list" ref={menuContainerRef}>
          {hasFilter && (
            <TextInput
              value={filterValue}
              label={filterLabel}
              onChange={onChange}
            />
          )}
          {items.map((item) => (
            <Item
              key={item.value}
              onSelect={onSelect}
              isSelected={checkSelected(item)}
              onDeselect={onDeselect}
              value={item}
            />
          ))}
        </StyledSelect>
      </>
    );
  };

  return (
    <Popover
      closeOnClickOutside
      onClose={removeKeyboardListener}
      onOpenFinished={setupKeyboardInteraction}
      content={renderContent}
    >
      {children}
    </Popover>
  );
};

export default Select;
