import { KeyboardEventHandler, useLayoutEffect, useRef, useState } from "react";
import TaskEditorContainer from "./TaskEditor.style";
import { Button } from "common/components";
import { faFlag, faBookmark } from "@fortawesome/free-regular-svg-icons";

const Task: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

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

  const preventNewLine: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <TaskEditorContainer>
      <div className="input-wrapper">
        <textarea
          spellCheck={false}
          className="title"
          placeholder="Task's title"
          ref={titleInputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={preventNewLine}
        />
        <textarea
          spellCheck={false}
          className="description"
          placeholder="Task's description"
          ref={descriptionInputRef}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
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
        <Button size="sm" disabled={!title}>
          Add task
        </Button>
        <Button size="sm" alternative="reverse">
          Cancel
        </Button>
      </div>
    </TaskEditorContainer>
  );
};
export default Task;
