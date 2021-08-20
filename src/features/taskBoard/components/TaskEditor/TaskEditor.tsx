import {
  KeyboardEventHandler,
  MouseEventHandler,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import TaskEditorContainer from "./TaskEditor.style";
import { Button, TextArea } from "common/components";
import { faFlag, faBookmark } from "@fortawesome/free-regular-svg-icons";
import { EntityId } from "@reduxjs/toolkit";
import { Task } from "features/taskBoard/types";
import { useDispatch, useInput } from "common/hooks";
import { addTask } from "../../taskBoardSlice";

type TaskEditorProps =
  | {
      mode: "add";
      onCancel?: MouseEventHandler;
      sectionId: EntityId;
    }
  | { mode: "edit"; onCancel?: MouseEventHandler; taskId: EntityId };

const TaskEditor: React.FC<TaskEditorProps> = (props) => {
  const [title, titleErrors, resetTitle, onTitleChange] =
    useInput<HTMLTextAreaElement>("", {
      maxLength: { value: 500 },
    });
  const [
    description,
    descriptionErrors,
    resetDescription,
    onDescriptionChange,
  ] = useInput<HTMLTextAreaElement>("", {
    maxLength: { value: 1000 },
  });
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (titleInputRef.current) {
      updateTextareaHeight(titleInputRef.current);
    }
  }, [title]);

  useLayoutEffect(() => {
    if (descriptionInputRef.current) {
      updateTextareaHeight(descriptionInputRef.current);
    }
  }, [description]);

  const updateTextareaHeight = (textarea: HTMLTextAreaElement) => {
    // Skrink textarea in case its content shorten
    textarea.style.height = "0px";
    // Update textarea's height based on its content
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addOrEditTask();
    }
  };

  const addOrEditTask = () => {
    if (props.mode === "add" && title.trim()) {
      let newTask: Omit<Task, "id" | "order"> = {
        createdAt: new Date().toString(),
        title: title.trim(),
        description,
        updatedAt: new Date().toJSON(),
      };
      dispatch(addTask(props.sectionId, newTask));
      resetTitle();
      resetDescription();
    }
  };

  const checkError = useMemo(() => {
    const titleErrorCount = Object.values(titleErrors).filter((x) => x).length;
    const descriptionErrorCount = Object.values(descriptionErrors).filter(
      (x) => x
    ).length;
    console.log(1);
    return titleErrorCount > 0 || descriptionErrorCount > 0;
  }, [descriptionErrors, titleErrors]);

  return (
    <TaskEditorContainer>
      <div className="input-wrapper">
        <TextArea
          errors={titleErrors}
          hideErrorMessage
          label="Title"
          onChange={onTitleChange}
          onKeyDown={onEnter}
          spellCheck={false}
          value={title}
        />
        <TextArea
          errors={descriptionErrors}
          hideErrorMessage
          label="Description"
          onChange={onDescriptionChange}
          spellCheck={false}
          value={description}
        />
      </div>
      <div className="error">
        <p>
          {titleErrors?.["maxLength"] && `Title: ${titleErrors?.["maxLength"]}`}
        </p>
        <p>
          {descriptionErrors?.["maxLength"] &&
            `Description: ${titleErrors?.["maxLength"]}`}
        </p>
      </div>
      <div className="task-options">
        <Button
          size="sx"
          icon={faBookmark}
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
          disabled={!title || checkError}
          onClick={addOrEditTask}
        >
          Add task
        </Button>
        <Button size="sm" alternative="reverse" onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
    </TaskEditorContainer>
  );
};
export default TaskEditor;
