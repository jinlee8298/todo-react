import { KeyboardEventHandler, useLayoutEffect, useMemo, useRef } from "react";
import TaskEditorContainer from "./TaskEditor.style";
import { Button } from "common/components";
import { faFlag, faTag } from "@fortawesome/free-solid-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import { Task } from "features/taskBoard/types";
import { useDispatch, useInput } from "common/hooks";
import { addTask, updateTask } from "../../taskBoardSlice";
import { updateTextareaHeight } from "common/components/TextArea/TextArea";

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
      let newTask: Omit<Task, "id"> = {
        createdAt: new Date().toString(),
        title: title.trim(),
        description: description.trim(),
        updatedAt: new Date().toJSON(),
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

      dispatch(updateTask({ id: task.id, changes }));
      onCancel?.();
    }
  };

  const checkError = useMemo(() => {
    const titleErrorCount = Object.values(titleErrors).filter((x) => x).length;
    const descriptionErrorCount = Object.values(descriptionErrors).filter(
      (x) => x
    ).length;
    return titleErrorCount > 0 || descriptionErrorCount > 0;
  }, [descriptionErrors, titleErrors]);

  return (
    <TaskEditorContainer>
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
        <Button
          size="sx"
          icon={faFlag}
          title="Set priorities"
          alternative="reverse"
        />
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
