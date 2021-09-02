import {
  faPen,
  faTrashAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EntityId } from "@reduxjs/toolkit";
import { Button, TextArea } from "common/components";
import { ConfirmDialog } from "common/components";
import {
  useConfirmDialog,
  useDispatch,
  useInput,
  useSelector,
} from "common/hooks";
import { commentSelector } from "features/taskBoard/store/commentReducer";
import {
  deleteComment,
  updateComment,
} from "features/taskBoard/taskBoardSlice";
import { FC, useEffect, useMemo, useState } from "react";
import StyledComment from "./TaskComment.style";

type TaskCommentProps = {
  commentId: EntityId;
  taskId: EntityId;
};

const TaskComment: FC<TaskCommentProps> = ({ commentId, taskId, ...props }) => {
  const comment = useSelector((state) =>
    commentSelector.selectById(state.taskBoard, commentId)
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [showConfirm, hideConfirm, dialogProps] = useConfirmDialog();
  const [value, errors, , onChange, setValue] = useInput("", {
    maxLength: { value: 15000, message: "Character limit: 15000" },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (comment) {
      setValue(comment.content);
    }
  }, [comment, editing, setValue]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const onDeleteComment = () => {
    showConfirm({
      title: "Delete comment?",
      message: "Are you sure you want to delete this comment?",
      acceptButtonLabel: "Delete",
      acceptButtonConfig: { variant: "danger", icon: faTrashAlt },
      rejectButtonLabel: "Cancel",
      onReject: hideConfirm,
      onEsc: hideConfirm,
      backdropClick: hideConfirm,
      onConfirm: () => dispatch(deleteComment(taskId, commentId)),
    });
  };

  const toggleEdit = () => {
    setEditing((v) => !v);
  };

  const onUpdateComment = () => {
    if (value.trim()) {
      dispatch(updateComment({ id: commentId, changes: { content: value } }));
    }
    toggleEdit();
  };

  const checkError = useMemo(() => {
    const contentErrorCount = Object.values(errors).filter((x) => x).length;
    return contentErrorCount > 0;
  }, [errors]);

  return (
    <StyledComment>
      <div className="icon">
        <FontAwesomeIcon fixedWidth icon={faUserCircle} />
      </div>
      <div className="details">
        {editing ? (
          <>
            <TextArea
              label="Comment"
              value={value}
              onChange={onChange}
              errors={errors}
              minRows={3}
              maxRows={10}
            />
            <Button
              aria-label="Update"
              disabled={!value.trim() || checkError}
              size="sm"
              onClick={onUpdateComment}
            >
              Update
            </Button>
            <Button
              aria-label="Cancel"
              size="sm"
              alternative="reverse"
              onClick={toggleEdit}
            >
              Cancel
            </Button>
          </>
        ) : (
          <div>
            <span className="user">Current user</span>
            <span className="time">
              {comment && formatDate(comment.updatedAt)}
            </span>
            <span className="actions">
              <Button
                aria-label="Edit comment"
                size="sx"
                alternative="reverse"
                icon={faPen}
                onClick={toggleEdit}
              />
              <Button
                aria-label="Delete comment"
                size="sx"
                alternative="reverse"
                icon={faTrashAlt}
                onClick={onDeleteComment}
              />
            </span>
            <div className="content">{comment?.content}</div>
          </div>
        )}
      </div>

      <ConfirmDialog {...dialogProps} />
    </StyledComment>
  );
};

export default TaskComment;
