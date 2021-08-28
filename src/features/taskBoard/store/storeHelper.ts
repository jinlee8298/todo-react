import { EntityId, Update } from "@reduxjs/toolkit";
import {
  commentAdapter,
  commentSelector,
  initialState,
  labelAdapter,
  labelSelector,
  projectAdapter,
  projectSelector,
  sectionAdapter,
  sectionSelector,
  taskAdapter,
  taskSelector,
} from "../taskBoardSlice";
import { Task, Comment, TaskSection } from "../types";

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
  parentId: EntityId | null,
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

  if (parentId) {
    duplicatedTask.parentTaskId = parentId;
  }

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
        duplicatedTask.id,
        subTaskId,
        duplicateComments
      );
      duplicatedTask.subTaskIds.push(newSubTaskId);
    });
  }

  taskAdapter.addOne(state.tasks, duplicatedTask);

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

  if (duplicatedTask.parentTaskId) {
    const parentTask = taskSelector.selectById(
      state,
      duplicatedTask.parentTaskId
    );
    if (parentTask) {
      taskAdapter.updateOne(state.tasks, {
        id: parentTask.id,
        changes: { subTaskIds: [...parentTask.subTaskIds, duplicatedTask.id] },
      });
    }
  }

  return duplicatedTask.id;
};

export const duplicateSection = (
  state: typeof initialState,
  projectId: EntityId,
  sectionId: EntityId
) => {
  const originSection = sectionSelector.selectById(state, sectionId);
  const project = projectSelector.selectById(state, projectId);

  if (!originSection || !project) {
    return;
  }

  const newSection: TaskSection = {
    name: originSection.name,
    taskIds: [],
    id: generateTaskId(),
  };
  originSection.taskIds.forEach((taskId) => {
    const duplicatedTaskId = duplicateTask(state, null, null, taskId, false);
    newSection.taskIds.push(duplicatedTaskId);
  });
  sectionAdapter.addOne(state.sections, newSection);
  projectAdapter.updateOne(state.projects, {
    id: projectId,
    changes: {
      sectionIds: [...project.sectionIds, newSection.id],
    },
  });
};

const markTaskFinished = (state: typeof initialState, taskId: EntityId) => {
  const task = taskSelector.selectById(state, taskId);
  if (!task) {
    return;
  }

  if (task.subTaskIds.length > 0) {
    task.subTaskIds.forEach((subTaskId) => markTaskFinished(state, subTaskId));
  }

  taskAdapter.updateOne(state.tasks, {
    id: taskId,
    changes: { finished: true },
  });
};

const markTaskUnfinished = (state: typeof initialState, taskId: EntityId) => {
  const task = taskSelector.selectById(state, taskId);
  if (!task) {
    return;
  }

  if (task.parentTaskId) {
    markTaskUnfinished(state, task.parentTaskId);
  }

  taskAdapter.updateOne(state.tasks, {
    id: taskId,
    changes: { finished: false },
  });
};

export const updateTask = (
  state: typeof initialState,
  update: Update<Omit<Task, "id" | "updatedAt" | "createdAt">>
) => {
  const updateObj = update as Update<Omit<Task, "id">>;
  updateObj.changes.updatedAt = new Date().toJSON();

  if (typeof updateObj.changes.finished === "boolean") {
    if (updateObj.changes.finished) {
      markTaskFinished(state, updateObj.id);
    } else {
      markTaskUnfinished(state, updateObj.id);
    }
  }

  taskAdapter.updateOne(state.tasks, updateObj);
};

export const updateComment = (
  state: typeof initialState,
  update: Update<Omit<Comment, "id" | "updatedAt" | "createdAt">>
) => {
  const updateObj = update as Update<Omit<Comment, "id">>;
  updateObj.changes.updatedAt = new Date().toJSON();
  commentAdapter.updateOne(state.comments, updateObj);
};
