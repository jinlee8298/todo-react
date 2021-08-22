import { KeyboardEventHandler, useLayoutEffect, useMemo, useRef } from "react";
import TaskEditorContainer from "./TaskEditor.style";
import { Button } from "common/components";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import { Task, TaskPriority } from "features/taskBoard/types";
import { useDispatch, useInput } from "common/hooks";
import { addTask, updateTask } from "../../taskBoardSlice";
import { updateTextareaHeight } from "common/components/TextArea/TextArea";
import TaskPrioritySelect, {
  TaskPrioritySelectRef,
} from "./TaskPrioritySelect/TaskPrioritySelect";

type TaskEditorProps = {
  mode: "add" | "edit";
  onCancel?: () => void;
  sectionId?: EntityId;
  task?: Task;
};

const TaskEditor: React.FC<TaskEditorProps> = ({
  mode,
  sectionId,
  task,
  onCancel,
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
  const taskPriority = useRef<TaskPrioritySelectRef>(null);
  const dispatch = useDispatch();

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

  const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addOrEditTask();
    }
  };

  const addOrEditTask = () => {
    if (!title.trim()) {
      return;
    }

    if (mode === "add") {
      const selectedPriority =
        taskPriority?.current?.selected || TaskPriority.Low;
      const newTask: Omit<Task, "id"> = {
        createdAt: new Date().toString(),
        title: title.trim(),
        description: description.trim(),
        updatedAt: new Date().toJSON(),
        priority: selectedPriority,
      };
      dispatch(addTask(sectionId, newTask));
      resetTitle();
      resetDescription();
    } else if (task) {
      const changes: Partial<Task> = {};

      if (task.title !== title) {
        changes.title = title;
      }
      if (task.description !== description.trim()) {
        changes.description = description;
      }
      if (task.priority !== taskPriority?.current?.selected) {
        changes.priority = taskPriority?.current?.selected;
      }

      dispatch(updateTask({ id: task.id, changes }));
      onCancel?.();
    }
    taskPriority?.current?.reset();
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
      onCancel?.();
    }
  };

  return (
    <TaskEditorContainer onKeyDown={onKeyDown}>
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
        <Button
          size="sx"
          icon={faTag}
          title="Add label(s)"
          alternative="reverse"
        />
        <TaskPrioritySelect taskId={task?.id} ref={taskPriority} />
      </div>
      <div className="button-group">
        <Button
          size="sm"
          disabled={!title.trim() || checkError}
          onClick={addOrEditTask}
        >
          {mode === "add" ? "Add task" : "Save"}
        </Button>
        <Button size="sm" alternative="reverse" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </TaskEditorContainer>
  );
};
export default TaskEditor;
