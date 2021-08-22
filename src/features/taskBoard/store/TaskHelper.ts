import { EntityId } from "@reduxjs/toolkit";
import {
  commentAdapter,
  commentSelector,
  initialState,
  labelAdapter,
  labelSelector,
  sectionAdapter,
  sectionSelector,
  taskAdapter,
  taskSelector,
} from "../taskBoardSlice";

export const generateTaskId = (): EntityId => {
  return Date.now().toString() + Math.round(Math.random() * 10000);
};

export const deleteTask = (
  state: typeof initialState,
  sectionId: EntityId | null,
  taskId: EntityId
) => {
  if (sectionId) {
    const section = sectionSelector.selectById(state, sectionId);
    if (section) {
      const taskIds = [...section.taskIds];
      sectionAdapter.updateOne(state.sections, {
        id: sectionId,
        changes: { taskIds: taskIds.filter((id) => id !== taskId) },
      });
    }
  }

  const taskToDelete = taskSelector.selectById(state, taskId);
  if (!taskToDelete) {
    return;
  }

  // Remove taskId from label entity
  if (taskToDelete.labelIds.length > 0) {
    taskToDelete.labelIds.forEach((labelId) => {
      const label = labelSelector.selectById(state, labelId);
      if (label) {
        labelAdapter.updateOne(state.labels, {
          id: labelId,
          changes: { taskIds: label.taskIds.filter((id) => id !== taskId) },
        });
      }
    });
  }

  // Remove all comments belongs to taskToDelete
  if (taskToDelete.commentIds.length > 0) {
    commentAdapter.removeMany(state.comments, taskToDelete.commentIds);
  }

  if (taskToDelete.subTaskIds.length > 0) {
    taskToDelete.subTaskIds.forEach((subTaskId) =>
      deleteTask(state, null, subTaskId)
    );
  }

  if (taskToDelete.parentTaskId) {
    const parentTask = taskSelector.selectById(
      state,
      taskToDelete.parentTaskId
    );
    if (parentTask) {
      taskAdapter.updateOne(state.tasks, {
        id: parentTask.id,
        changes: {
          subTaskIds: parentTask.subTaskIds?.filter((id) => id !== taskId),
        },
      });
    }
  }

  taskAdapter.removeOne(state.tasks, taskId);
};

export const duplicateTask = (
  state: typeof initialState,
  sectionId: EntityId | null,
  taskId: EntityId,
  duplicateComments: boolean
): EntityId => {
  const originTask = taskSelector.selectById(state, taskId);
  if (!originTask) {
    return -1;
  }

  const createdAt = new Date().toJSON();
  const duplicatedTask = {
    ...originTask,
    id: generateTaskId(),
    updatedAt: createdAt,
    createdAt,
  };

  if (sectionId) {
    const section = sectionSelector.selectById(state, sectionId);
    if (section) {
      sectionAdapter.updateOne(state.sections, {
        id: sectionId,
        changes: { taskIds: [...section.taskIds, duplicatedTask.id] },
      });
    }
  }

  duplicatedTask.commentIds = [];
  if (originTask.commentIds.length > 0 && duplicateComments) {
    originTask.commentIds.forEach((commentId) => {
      const comment = commentSelector.selectById(state, commentId);
      if (comment) {
        const createdAt = new Date().toJSON();
        const newComment = {
          ...comment,
          id: generateTaskId(),
          updatedAt: createdAt,
          createdAt,
        };
        commentAdapter.addOne(state.comments, newComment);
        duplicatedTask.commentIds.push(newComment.id);
      }
    });
  }

  if (originTask.subTaskIds.length > 0) {
    duplicatedTask.subTaskIds = [];
    originTask.subTaskIds.forEach((subTaskId) => {
      const newSubTaskId = duplicateTask(
        state,
        null,
        subTaskId,
        duplicateComments
      );
      duplicatedTask.subTaskIds.push(newSubTaskId);
    });
  }

  if (originTask.labelIds.length > 0) {
    originTask.labelIds.forEach((labelId) => {
      const label = labelSelector.selectById(state, labelId);
      if (label) {
        labelAdapter.updateOne(state.labels, {
          id: labelId,
          changes: {
            taskIds: [...label.taskIds, duplicatedTask.id],
          },
        });
      }
    });
  }

  if (originTask.parentTaskId) {
    const parentTask = taskSelector.selectById(state, originTask.parentTaskId);
    if (parentTask) {
      taskAdapter.updateOne(state.tasks, {
        id: parentTask.id,
        changes: { subTaskIds: [...parentTask.subTaskIds, duplicatedTask.id] },
      });
    }
  }

  taskAdapter.addOne(state.tasks, duplicatedTask);
  return duplicatedTask.id;
};
