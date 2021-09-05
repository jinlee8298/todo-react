import StyledCommentsTab from "./CommentsTab.style";
import { Button, TextArea } from "common/components";
import { useDispatch, useInput, useSelector } from "common/hooks";
import { EntityId } from "@reduxjs/toolkit";
import { FC, useMemo, memo } from "react";
import TaskComment from "./TaskComment/TaskComment";
import { addComment } from "features/taskBoard/taskBoardSlice";
import { taskSelector } from "features/taskBoard/store/taskReducer";

type CommentsTabProps = {
  taskId: EntityId;
};

const CommentsTab: FC<CommentsTabProps> = memo(({ taskId }) => {
  const dispatch = useDispatch();
  const [value, errors, reset, onChange] = useInput("", {
    maxLength: {
      value: 15000,
      message: "Character limit: {{current}}/ 15000",
    },
  });
  const commentIds = useSelector(
    (state) => taskSelector.selectById(state.taskBoard, taskId)?.commentIds
  );

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
        {commentIds?.map((id) => (
          <TaskComment key={id} taskId={taskId} commentId={id} />
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
            aria-label="Add Comment"
            onClick={onAddComment}
            disabled={checkError || !value.trim()}
            size="sm"
          >
            Add Comment
          </Button>
        </div>
      </div>
    </StyledCommentsTab>
  );
});

export default CommentsTab;
