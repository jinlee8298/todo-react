import StyledCommentsTab from "./CommentsTab.style";
import { Button, TextArea } from "common/components";
import { useDispatch, useInput } from "common/hooks";
import { EntityId } from "@reduxjs/toolkit";
import { FC, useMemo } from "react";
import TaskComment from "./TaskComment/TaskComment";
import { addComment } from "features/taskBoard/taskBoardSlice";

type CommentsTabProps = {
  taskId: EntityId;
  commentIds?: EntityId[];
};

const CommentsTab: FC<CommentsTabProps> = ({
  taskId,
  commentIds = [],
  ...props
}) => {
  const dispatch = useDispatch();
  const [value, errors, reset, onChange] = useInput("", {
    maxLength: {
      value: 15000,
      message: "Character limit: {{current}}/ 15000",
    },
  });

  const mapError = useMemo(() => {
    return errors ? Object.values(errors).filter((x) => x) : [];
  }, [errors]);

  const checkError = useMemo(() => {
    const titleErrorCount = Object.values(errors).filter((x) => x).length;
    return titleErrorCount > 0;
  }, [errors]);

  const onAddComment = () => {
    dispatch(addComment(taskId, { content: value }));
    reset();
  };

  return (
    <StyledCommentsTab>
      <div className="comment-container">
        {commentIds.map((id) => (
          <TaskComment taskId={taskId} commentId={id} />
        ))}
      </div>
      <div className="comment-actions">
        <TextArea
          hideErrorMessage
          errors={errors}
          value={value}
          onChange={onChange}
          label="Comment"
          title="Comment"
          minRows={3}
          maxRows={10}
        ></TextArea>
        {mapError.map((errorMessage) => (
          <p key={errorMessage} className="error-message">
            {errorMessage?.replace("{{current}}", value.length.toString())}
          </p>
        ))}
        <div className="button-group">
          <Button
            onClick={onAddComment}
            disabled={checkError || !value.trim()}
            size="sm"
          >
            AddComment
          </Button>
        </div>
      </div>
    </StyledCommentsTab>
  );
};

export default CommentsTab;
