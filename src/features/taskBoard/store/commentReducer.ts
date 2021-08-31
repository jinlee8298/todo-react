import {
  createEntityAdapter,
  EntityId,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import { generateUID } from "common/utilitites";
import { TaskBoardStore } from "../taskBoardSlice";
import { Comment } from "../types";
import { taskSelector, updateTaskHandler } from "./taskReducer";

export const commentAdapter = createEntityAdapter<Comment>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});
export const commentSelector = commentAdapter.getSelectors(
  (state: TaskBoardStore) => state.comments
);

export const updateCommentHandler = (
  state: TaskBoardStore,
  update: Update<Omit<Comment, "id" | "updatedAt" | "createdAt">>
) => {
  const updateObj = update as Update<Omit<Comment, "id">>;
  updateObj.changes.updatedAt = new Date().toJSON();
  commentAdapter.updateOne(state.comments, updateObj);
};

// Reducer

const addComment = {
  prepare: (
    taskId: EntityId,
    comment: Omit<Comment, "id" | "updatedAt" | "createdAt">
  ) => ({ payload: { taskId, comment } }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{
      taskId: EntityId;
      comment: Omit<Comment, "id" | "updatedAt" | "createdAt">;
    }>
  ) => {
    const { taskId, comment } = action.payload;
    const task = taskSelector.selectById(state, taskId);
    if (!task) {
      return;
    }

    const createdAt = new Date().toJSON();
    const newComment: Comment = {
      ...comment,
      id: generateUID(),
      createdAt,
      updatedAt: createdAt,
    };
    commentAdapter.addOne(state.comments, newComment);

    const taskComments = [...(task.commentIds || []), newComment.id];
    updateTaskHandler(state, {
      id: taskId,
      changes: { commentIds: taskComments },
    });
  },
};

const updateComment = (
  state: TaskBoardStore,
  action: PayloadAction<Update<Omit<Comment, "id" | "createdAt" | "updatedAt">>>
) => {
  updateCommentHandler(state, action.payload);
};

const deleteComment = {
  prepare: (taskId: EntityId, commentId: EntityId) => ({
    payload: { taskId, commentId },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{ taskId: EntityId; commentId: EntityId }>
  ) => {
    const { taskId, commentId } = action.payload;
    const task = taskSelector.selectById(state, taskId);
    if (!task) {
      return;
    }

    const taskComments = [...(task.commentIds || [])];

    updateTaskHandler(state, {
      id: taskId,
      changes: {
        commentIds: taskComments.filter((id) => id !== commentId),
      },
    });
    commentAdapter.removeOne(state.comments, commentId);
  },
};

const commentReducer = {
  addComment,
  updateComment,
  deleteComment,
};

export default commentReducer;
