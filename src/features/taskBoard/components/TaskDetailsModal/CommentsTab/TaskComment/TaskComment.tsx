import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EntityId } from "@reduxjs/toolkit";
import { useSelector } from "common/hooks";
import { commentSelector } from "features/taskBoard/taskBoardSlice";
import { FC } from "react";
import StyledComment from "./TaskComment.style";

type TaskCommentProps = {
  commentId: EntityId;
};

const TaskComment: FC<TaskCommentProps> = ({ commentId, ...props }) => {
  const comment = useSelector((state) =>
    commentSelector.selectById(state.taskBoard, commentId)
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <StyledComment>
      <div className="icon">
        <FontAwesomeIcon fixedWidth icon={faUserCircle} />
      </div>
      <div className="details">
        <div>
          <span className="user">Current user</span>
          <span className="time">
            {comment && formatDate(comment.updatedAt)}
          </span>
        </div>
        <div className="content">{comment?.content}</div>
      </div>
    </StyledComment>
  );
};

export default TaskComment;
