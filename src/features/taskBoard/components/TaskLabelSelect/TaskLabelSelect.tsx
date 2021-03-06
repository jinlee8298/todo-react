import { faPlus, faTag } from "@fortawesome/free-solid-svg-icons";
import StyledTaskLabelSelect from "./TaskLabelSelect.style";
import { Button, Select } from "common/components";
import { useDispatch, useSelector } from "common/hooks";
import {
  addLabel,
  addLabelToTask,
  removeLabelFromTask,
} from "features/taskBoard/taskBoardSlice";
import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  MouseEventHandler,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { EntityId } from "@reduxjs/toolkit";
import { shallowEqual } from "react-redux";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { COLOR_LIST } from "common/constants";
import { taskSelector } from "features/taskBoard/store/taskReducer";
import { labelSelector } from "features/taskBoard/store/labelReducer";

type TaskLabelSelectProps = {
  taskId?: EntityId;
  mode?: "add" | "edit" | "standalone";
  onSelect?: (value: SelectItem) => void;
  onDeselect?: (value: SelectItem) => void;
  disabled?: boolean;
};

export type TaskLabelSelectRef = {
  patchTaskLabel: () => void;
  reset: () => void;
};

const TaskLabelSelect: ForwardRefRenderFunction<
  TaskLabelSelectRef,
  TaskLabelSelectProps
> = ({ taskId, mode, disabled, ...props }, ref) => {
  const labels = useSelector((state) =>
    labelSelector.selectAll(state.taskBoard)
  );
  const taskLabelIds = useSelector(
    (state) =>
      taskId ? taskSelector.selectById(state.taskBoard, taskId)?.labelIds : [],
    shallowEqual
  );
  const [filterValue, setFilterValue] = useState<string>("");
  const newLabelName = useRef<string>("");
  const dispatch = useDispatch();
  const selectItems = useMemo(() => {
    return labels.map((label) => ({
      value: label.id as string,
      label: label.name,
      icon: faTag,
      iconColor: label.color,
    }));
  }, [labels]);
  const [selected, setSelected] = useState<SelectItem[]>(
    mode === "edit" && taskLabelIds
      ? selectItems.filter((item) => taskLabelIds.includes(item.value))
      : []
  );
  const filteredItems = useMemo(() => {
    return selectItems.filter((item) => {
      const filterString = filterValue.trim().toLowerCase();
      if (filterString) {
        const itemLabel = item.label.trim().toLowerCase();
        return itemLabel.includes(filterString);
      } else {
        return true;
      }
    });
  }, [selectItems, filterValue]);

  const onFilterChange = (newFilterValue: string) => {
    setFilterValue(newFilterValue);
  };

  const createNewLabel: MouseEventHandler = (e) => {
    e.stopPropagation();
    if (filterValue.trim()) {
      dispatch(addLabel({ name: filterValue, color: COLOR_LIST[0].color }));
      newLabelName.current = filterValue;
    }
  };

  const onSelectLabel = (labelItem: SelectItem) => {
    setSelected((items) => [...items, labelItem]);
    props?.onSelect?.(labelItem);
  };

  const onOpenSelect = () => {
    if (taskLabelIds && mode === "standalone") {
      setSelected(
        selectItems.filter(({ value: labelId }) =>
          taskLabelIds.includes(labelId)
        )
      );
    }
  };

  const onDeselectLabel = (labelItem: SelectItem) => {
    setSelected((items) =>
      items.filter((item) => item.value !== labelItem.value)
    );
    props?.onDeselect?.(labelItem);
  };

  const onCloseFinishedSelect = () => {
    setFilterValue("");
  };

  const onCloseSelect = () => {
    if (mode === "standalone") {
      patchTaskLabel();
    }
  };

  const patchTaskLabel = () => {
    if (taskId) {
      labels.forEach((label) => {
        const isSelected = !!selected.find((item) => item.value === label.id);
        if (isSelected && !label.taskIds.includes(taskId)) {
          dispatch(addLabelToTask(taskId, label.id));
        }
        if (!isSelected && label.taskIds.includes(taskId)) {
          dispatch(removeLabelFromTask(taskId, label.id));
        }
      });
    }
  };

  const reset = () => {
    setSelected([]);
  };

  useEffect(() => {
    // Handle for when add new label then auto select it
    if (newLabelName.current) {
      const addedLabel = labels.find((x) => x.name === newLabelName.current);
      if (addedLabel) {
        const labelItem = {
          value: addedLabel.id as string,
          label: addedLabel.name,
          iconColor: addedLabel.color,
        };
        setSelected((items) => [...items, labelItem]);
        props?.onSelect?.(labelItem);
      }

      newLabelName.current = "";
    }
  }, [labels, props]);

  useImperativeHandle(ref, () => ({
    patchTaskLabel,
    reset,
  }));

  const noResultContent = (
    <StyledTaskLabelSelect>
      <p>Label not found</p>
      {filterValue.trim() && (
        <p className="add-label" onClick={createNewLabel}>
          <Button
            aria-label={`Add new label: ${filterValue.trim()}`}
            onClick={createNewLabel}
            size="sx"
            alternative="reverse"
            icon={faPlus}
          ></Button>
          Create "{filterValue}"
        </p>
      )}
    </StyledTaskLabelSelect>
  );

  return (
    <Select
      selected={selected}
      filterLabel="Search label"
      noResultContent={noResultContent}
      onSelect={onSelectLabel}
      onDeselect={onDeselectLabel}
      onFilterChange={onFilterChange}
      onClose={onCloseSelect}
      onCloseFinished={onCloseFinishedSelect}
      onOpen={onOpenSelect}
      items={filteredItems}
      hasFilter
    >
      <Button
        aria-label="Select task's labels"
        disabled={disabled}
        size="sx"
        icon={faTag}
        title="Set label(s)"
        alternative="reverse"
      />
    </Select>
  );
};

const ForwardedComponent = memo(forwardRef(TaskLabelSelect));

export default ForwardedComponent;
