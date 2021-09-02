import {
  ComponentPropsWithoutRef,
  KeyboardEventHandler,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TaskEditorContainer from "./TaskEditor.style";
import { Button, Label as LabelComponent } from "common/components";
import { EntityId } from "@reduxjs/toolkit";
import { Label, Task, TaskPriority } from "features/taskBoard/types";
import { useDispatch, useInput, useSelector } from "common/hooks";
import { addSubTask, addTask, updateTask } from "../../taskBoardSlice";
import { updateTextareaHeight } from "common/components/TextArea/TextArea";
import TaskPrioritySelect, {
  TaskPrioritySelectRef,
} from "./TaskPrioritySelect/TaskPrioritySelect";
import TaskLabelSelect, {
  TaskLabelSelectRef,
} from "./TaskLabelSelect/TaskLabelSelect";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { shallowEqual } from "react-redux";
import { labelSelector } from "features/taskBoard/store/labelReducer";
import { useRouteMatch } from "react-router-dom";

type TaskEditorProps = {
  mode: "add" | "edit" | "add-subtask";
  onCloseHandle?: () => void;
  sectionId?: EntityId;
  task?: Task;
  parentTaskId?: EntityId;
} & ComponentPropsWithoutRef<"div">;

const TaskEditor: React.FC<TaskEditorProps> = ({
  mode,
  sectionId,
  task,
  parentTaskId,
  onCloseHandle,
  ...props
}) => {
  const [title, titleErrors, resetTitle, onTitleChange] =
    useInput<HTMLTextAreaElement>(task ? task.title : "", {
      maxLength: { value: 500 },
    });
  const [
    description,
    descriptionErrors,
    resetDescription,
    onDescriptionChange,
  ] = useInput<HTMLTextAreaElement>(
    task && task.description ? task.description : "",
    {
      maxLength: { value: 1000 },
    }
  );
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const titleLineHeight = useRef<number | null>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionLineHeight = useRef<number | null>(null);
  const taskPriorityRef = useRef<TaskPrioritySelectRef>(null);
  const taskLabelRef = useRef<TaskLabelSelectRef>(null);
  const [selectedLabels, setSelectedLabels] = useState<SelectItem[]>([]);
  const taskLabels = useSelector(
    (state) =>
      task
        ? task.labelIds.map(
            (id) => labelSelector.selectEntities(state.taskBoard)[id]
          )
        : [],
    shallowEqual
  ) as Label[] | undefined;
  const dispatch = useDispatch();
  const match = useRouteMatch<{ projectId: string }>("/project/:projectId");

  useLayoutEffect(() => {
    if (titleInputRef.current) {
      if (!titleLineHeight.current) {
        const computedStyle = window.getComputedStyle(titleInputRef.current);
        titleLineHeight.current = Number(
          computedStyle.lineHeight.replace("px", "")
        );
      }
      const lineHeight = titleLineHeight.current;
      updateTextareaHeight(
        titleInputRef.current,
        lineHeight,
        1,
        Number.MAX_SAFE_INTEGER
      );
    }
  }, [title]);

  useLayoutEffect(() => {
    if (descriptionInputRef.current) {
      if (!descriptionLineHeight.current) {
        const computedStyle = window.getComputedStyle(
          descriptionInputRef.current
        );
        descriptionLineHeight.current = Number(
          computedStyle.lineHeight.replace("px", "")
        );
      }
      const lineHeight = descriptionLineHeight.current;
      updateTextareaHeight(
        descriptionInputRef.current,
        lineHeight,
        2,
        Number.MAX_SAFE_INTEGER
      );
    }
  }, [description]);

  useLayoutEffect(() => {
    // Focus then put cursor to the end of line
    // Normally when you focus to input, cursor will stay at the beginning of line
    // Reassign value to make the cursor place at the end of line
    if (titleInputRef.current) {
      titleInputRef.current.focus();
      const value = titleInputRef.current.value;
      titleInputRef.current.value = "";
      titleInputRef.current.value = value;
    }
  }, []);

  useEffect(() => {
    if (taskLabels && taskLabels.length > 0) {
      setSelectedLabels(
        taskLabels.map((label) => ({
          value: label.id as string,
          label: label.name,
          iconColor: label.color,
        }))
      );
    }
  }, [taskLabels]);

  const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      mode === "edit" ? onEditTask() : onAddTask();
    }
  };

  const onEditTask = () => {
    if (!title.trim() || !task) {
      return;
    }

    const changes: Partial<Task> = {};
    if (task.title !== title) {
      changes.title = title;
    }
    if (task.description !== description.trim()) {
      changes.description = description;
    }
    if (task.priority !== taskPriorityRef.current?.selected) {
      changes.priority = taskPriorityRef.current?.selected;
    }
    taskLabelRef.current?.patchTaskLabel();

    dispatch(updateTask({ id: task.id, changes }));
    onCloseHandle?.();
    taskPriorityRef.current?.reset();
    taskLabelRef.current?.reset();
    clearLabelList();
  };

  const onAddTask = () => {
    if (!title.trim()) {
      return;
    }

    const selectedPriority =
      taskPriorityRef?.current?.selected || TaskPriority.Low;
    const newTask: Omit<
      Task,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "commentIds"
      | "subTaskIds"
      | "finished"
    > = {
      title: title.trim(),
      description: description.trim(),
      priority: selectedPriority,
      labelIds: selectedLabels.map((item) => item.value) || [],
      projectId: match?.params.projectId,
    };
    if (mode === "add-subtask" && parentTaskId) {
      dispatch(addSubTask(parentTaskId, newTask));
    } else if (sectionId) {
      dispatch(addTask(sectionId, newTask));
    }
    resetTitle();
    resetDescription();
    taskPriorityRef.current?.reset();
    taskLabelRef.current?.reset();
    clearLabelList();
  };

  const checkError = useMemo(() => {
    const titleErrorCount = Object.values(titleErrors).filter((x) => x).length;
    const descriptionErrorCount = Object.values(descriptionErrors).filter(
      (x) => x
    ).length;
    return titleErrorCount > 0 || descriptionErrorCount > 0;
  }, [descriptionErrors, titleErrors]);

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onCloseHandle?.();
    }
  };

  const onSelectLabel = (selectItem: SelectItem) => {
    setSelectedLabels((labelList) => [...labelList, selectItem]);
  };

  const onDeselectLabel = (deselectItem: SelectItem) => {
    setSelectedLabels((labelList) =>
      labelList.filter((labelItem) => labelItem.value !== deselectItem.value)
    );
  };

  const clearLabelList = () => {
    setSelectedLabels([]);
  };

  return (
    <TaskEditorContainer {...props} onKeyDown={onKeyDown}>
      <div className="label-wrapper">
        {selectedLabels.map((labelItem) => (
          <LabelComponent
            color={labelItem.iconColor}
            key={labelItem.value}
            title={labelItem.label}
          >
            {labelItem.label}
          </LabelComponent>
        ))}
      </div>
      <div className="input-wrapper">
        <textarea
          onChange={onTitleChange}
          onKeyDown={onEnter}
          spellCheck={false}
          value={title}
          ref={titleInputRef}
          placeholder="Task name"
        />
        <textarea
          onChange={onDescriptionChange}
          spellCheck={false}
          value={description}
          ref={descriptionInputRef}
          placeholder="Description"
        />
      </div>
      <div className="error">
        <p>
          {titleErrors?.["maxLength"] && `Title: ${titleErrors?.["maxLength"]}`}
        </p>
        <p>
          {descriptionErrors?.["maxLength"] &&
            `Description: ${descriptionErrors?.["maxLength"]}`}
        </p>
      </div>
      <div className="task-options">
        <TaskLabelSelect
          mode={mode === "edit" ? "edit" : "add"}
          onSelect={onSelectLabel}
          onDeselect={onDeselectLabel}
          ref={taskLabelRef}
          taskId={task?.id}
        />
        <TaskPrioritySelect taskId={task?.id} ref={taskPriorityRef} />
      </div>
      <div className="button-group">
        <Button
          aria-label={mode === "edit" ? "Save" : "Add task"}
          size="sm"
          disabled={!title.trim() || checkError}
          onClick={mode === "edit" ? onEditTask : onAddTask}
        >
          {mode === "edit" ? "Save" : "Add task"}
        </Button>
        <Button
          aria-label="Cancel"
          size="sm"
          alternative="reverse"
          onClick={onCloseHandle}
        >
          Cancel
        </Button>
      </div>
    </TaskEditorContainer>
  );
};
export default TaskEditor;
