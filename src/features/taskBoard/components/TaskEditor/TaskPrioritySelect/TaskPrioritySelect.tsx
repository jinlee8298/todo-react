import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import { Button, Select } from "common/components";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { taskSelector } from "features/taskBoard/taskBoardSlice";
import { TaskPriority } from "features/taskBoard/types";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
  memo,
} from "react";
import { useSelector } from "common/hooks";

const PRIORITY_ITEM: SelectItem[] = [
  {
    value: TaskPriority.Low,
    label: "Low",
    icon: faFlag,
    iconColor: "var(--primary)",
  },
  {
    value: TaskPriority.Medium,
    label: "Medium",
    icon: faFlag,
    iconColor: "var(--success)",
  },
  {
    value: TaskPriority.High,
    label: "High",
    icon: faFlag,
    iconColor: "var(--warning)",
  },
  {
    value: TaskPriority.Urgent,
    label: "Urgent",
    icon: faFlag,
    iconColor: "var(--danger)",
  },
];

const PRIORITY_COLOR_MAPPING = {
  [TaskPriority.Urgent]: "danger" as "danger",
  [TaskPriority.High]: "warning" as "warning",
  [TaskPriority.Medium]: "success" as "success",
  [TaskPriority.Low]: "primary" as "primary",
};

type TaskPrioritySelectProps = {
  taskId?: EntityId;
  onSelect?: (value: SelectItem) => void;
};

export type TaskPrioritySelectRef = {
  selected: TaskPriority;
  reset: () => void;
};

const TaskPrioritySelect: ForwardRefRenderFunction<
  TaskPrioritySelectRef,
  TaskPrioritySelectProps
> = ({ taskId = 0, ...props }, ref) => {
  const [selected, setSelected] = useState<SelectItem>(PRIORITY_ITEM[0]);
  const task = useSelector((state) =>
    taskSelector.selectById(state.taskBoard, taskId)
  );

  const reset = () => {
    setSelected(PRIORITY_ITEM[0]);
  };

  const getButtonColor = () => {
    return PRIORITY_COLOR_MAPPING[selected.value as TaskPriority];
  };

  useEffect(() => {
    if (task) {
      const taskPriority = PRIORITY_ITEM.find((i) => i.value === task.priority);
      setSelected(taskPriority || PRIORITY_ITEM[0]);
    }
  }, [task]);

  useImperativeHandle(ref, () => ({
    selected: (selected.value as TaskPriority) || TaskPriority.Low,
    reset: reset,
  }));

  const onSelect = (value: SelectItem) => {
    setSelected(value);
    props?.onSelect?.(value);
  };

  return (
    <Select
      selected={selected}
      onSelect={onSelect}
      items={PRIORITY_ITEM}
      closeOnSelect
    >
      <Button
        size="sx"
        icon={faFlag}
        title="Set priorities"
        alternative="reverse"
        variant={getButtonColor()}
      />
    </Select>
  );
};

const ForwardedRefComponent = memo(forwardRef(TaskPrioritySelect));

export default ForwardedRefComponent;
