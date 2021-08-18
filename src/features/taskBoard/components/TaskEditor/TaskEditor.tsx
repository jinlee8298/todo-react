import {
  KeyboardEventHandler,
  MouseEventHandler,
  useLayoutEffect,
  useRef,
} from "react";
import TaskEditorContainer from "./TaskEditor.style";
import { Button } from "common/components";
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
      validate: validateTitle,
    });
  const [
    description,
    descriptionErrors,
    resetDescription,
    onDescriptionChange,
  ] = useInput<HTMLTextAreaElement>("", {
    validate: validateDesc,
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

  function validateTitle(v: string) {
    return [
      {
        valid: v.length <= 500,
        errorMessage: `Task name character limit: ${v.length}/500`,
        errorType: "maxLength",
      },
    ];
  }

  function validateDesc(v: string) {
    return [
      {
        valid: v.length <= 1000,
        errorMessage: `Task description character limit: ${v.length}/1000`,
        errorType: "maxLength",
      },
    ];
  }

  return (
    <TaskEditorContainer>
      <div className="input-wrapper">
        <textarea
          spellCheck={false}
          className="title"
          placeholder="Task's title"
          ref={titleInputRef}
          value={title}
          onChange={onTitleChange}
          onKeyDown={onEnter}
        />
        <textarea
          spellCheck={false}
          className="description"
          placeholder="Task's description"
          ref={descriptionInputRef}
          onChange={onDescriptionChange}
          value={description}
        />
      </div>
      <div className="error">
        <p>{titleErrors?.["maxLength"]?.message}</p>
        <p>{descriptionErrors?.["maxLength"]?.message}</p>
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
        <Button size="sm" disabled={!title} onClick={addOrEditTask}>
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
